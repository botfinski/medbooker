import CopyFooterText from "@/components/CopyFooterText";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

async function Register({ params: { userId } }: SearchParamProps) {
	const user = await getUser(userId);

	Sentry.metrics.set("user_view_register", user.name);

	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[860px] flex-1 flex-col py-10">
					<Image
						src="/assets/icons/logo-full.svg"
						height={1000}
						width={1000}
						alt="Logo MedBooker"
						className="mb-12 h-10 w-fit"
					/>

					<RegisterForm user={user} />

					<p className="copyright py-12">
						<CopyFooterText />
					</p>
				</div>
			</section>

			<Image
				src="/assets/images/register-img.png"
				height={1000}
				width={1000}
				alt=""
				className="side-img max-w-[390px]"
			/>
		</div>
	);
}

export default Register;
