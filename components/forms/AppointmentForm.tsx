"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { getAppointmentSchema } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
	createAppointment,
	updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
	userId,
	patientId,
	type = "create",
	appointment,
	setOpen,
}: {
	userId: string;
	patientId: string;
	type: "create" | "schedule" | "cancel";
	appointment?: Appointment | undefined;
	setOpen?: (open: boolean) => void;
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const AppointmentFormValidation = getAppointmentSchema(type);

	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
			primaryPhysician: appointment ? appointment?.primaryPhysician : "",
			schedule: appointment
				? new Date(appointment?.schedule!)
				: new Date(Date.now()),
			reason: appointment ? appointment.reason : "",
			note: appointment?.note || "",
			cancellationReason: appointment?.cancellationReason || "",
		},
	});

	async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
		setIsLoading(true);

		let status;
		switch (type) {
			case "schedule":
				status = "scheduled";
				break;
			case "cancel":
				status = "cancelled";
				break;
			default:
				status = "pending";
		}

		try {
			// CREATE APPOINTMENT

			if (type === "create" && patientId) {
				const appointment = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason!,
					note: values.note,
					status: status as Status,
				};

				const newAppointment = await createAppointment(appointment);

				if (newAppointment) {
					form.reset();
					router.push(
						`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
					);
				}
			} else {
				// SCHEDULE AND CANCEL APPOINTMENT
				// TODO/BUG: Clear cancellationReason after scheduling appointment/cancellationReason stays after cancel->schedule->cancel

				const appointmentToUpdate = {
					userId,
					appointmentId: appointment?.$id!,
					appointment: {
						primaryPhysician: values.primaryPhysician,
						schedule: new Date(values.schedule),
						status: status as Status,
						cancellationReason: values.cancellationReason,
					},
					type,
				};

				const updatedAppointment = await updateAppointment(appointmentToUpdate);

				if (updatedAppointment) {
					setOpen && setOpen(false);
					form.reset();
				}
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	}

	let buttonLabel;
	switch (type) {
		case "cancel":
			buttonLabel = "Cancel Appointment";
			break;
		case "schedule":
			buttonLabel = "Schedule Appointment";
			break;
		default:
			buttonLabel = "Submit Apppointment";
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				{type === "create" && (
					<section className="mb-12 space-y-4">
						<h1 className="header">New Appointment</h1>
						<p className="text-dark-700">Request a new appointment in 10 seconds.</p>
					</section>
				)}

				{type !== "cancel" && (
					<>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name="primaryPhysician"
							label="Doctor"
							placeholder="Select a doctor"
						>
							{Doctors.map((doctor, i) => (
								<SelectItem key={doctor.name + i} value={doctor.name}>
									<div className="flex cursor-pointer items-center gap-2">
										<Image
											src={doctor.image}
											width={32}
											height={32}
											alt=""
											className="rounded-full border border-dark-500"
										/>
										<p>{doctor.name}</p>
									</div>
								</SelectItem>
							))}
						</CustomFormField>

						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="schedule"
							label="Expected appointment date"
							showTimeSelect
							dateFormat="MM/dd/yyyy  -  h:mm aa"
						/>

						<div
							className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
						>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="reason"
								label="Appointment reason"
								placeholder="Annual montly check-up"
								disabled={type === "schedule"}
							/>

							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="note"
								label="Comments/notes"
								placeholder="Prefer afternoon appointments, if possible"
								disabled={type === "schedule"}
							/>
						</div>
					</>
				)}

				{type === "cancel" && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="cancellationReason"
						label="Reason for cancellation"
						placeholder="Enter reason for cancellation"
					/>
				)}

				<SubmitButton
					isLoading={isLoading}
					className={`${
						type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
					} w-full`}
				>
					{buttonLabel}
				</SubmitButton>
			</form>
		</Form>
	);
};

export default AppointmentForm;
