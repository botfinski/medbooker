"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserFormValidation } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { createUser } from "@/lib/actions/patient.actions";
import { GenderOptions } from "@/constants";

const RegisterForm = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	async function onSubmit({
		name,
		email,
		phone,
	}: z.infer<typeof UserFormValidation>) {
		setIsLoading(true);

		try {
			const userData = {
				name,
				email,
				phone,
			};
			const user = await createUser(userData);
			if (user) {
				router.push(`/patients/${user.$id}/register`);
			}
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
				<section className="space-y-4">
					<h1 className="header">Welcome 👋</h1>
					<p className="text-dark-700">Let us know more about yourself.</p>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Personal Information</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="name"
						placeholder="John Doe"
						iconSrc="/assets/icons/user.svg"
						iconAlt="user"
					/>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="email"
							label="Email"
							placeholder="johndoe@gmail.com"
							iconSrc="/assets/icons/email.svg"
							iconAlt="email icon"
						/>

						<CustomFormField
							fieldType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name="phone"
							label="Phone number"
							placeholder="123-456-789"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="birthDate"
							label="Date of birth"
						/>

						<CustomFormField
							fieldType={FormFieldType.SKELETON}
							control={form.control}
							name="gender"
							label="Gender"
							renderSkeleton={field => (
								<FormControl>
									<RadioGroup
										className="flex h-11 gap-6 xl:justify-between"
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										{GenderOptions.map((option, i) => (
											<div key={option + i} className="radio-group">
												<RadioGroupItem value={option} id={option} />
												<Label htmlFor={option} className="cursor-pointer">
													{option}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>
				</section>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default RegisterForm;
