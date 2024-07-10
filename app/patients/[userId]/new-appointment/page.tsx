import CopyFooterText from "@/components/CopyFooterText";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

async function NewAppointment({ params: { userId } }: SearchParamProps) {
	const patient = await getPatient(userId);

	Sentry.metrics.set("user_view_new_appointment", patient.name);

	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container my-auto">
				<div className="sub-container max-w-[860px] flex-1 justify-between">
					<Image
						src="/assets/icons/logo-full.svg"
						height={1000}
						width={1000}
						alt="Logo MedBooker"
						className="mb-12 h-10 w-fit"
					/>

					<AppointmentForm type="create" patientId={patient?.$id} userId={userId} />

					<p className="copyright mt-10 py-12">
						<CopyFooterText />
					</p>
				</div>
			</section>

			<Image
				src="/assets/images/appointment-img.png"
				height={1500}
				width={1500}
				alt=""
				className="side-img max-w-[390px] bg-bottom"
			/>
		</div>
	);
}

export default NewAppointment;
