import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User, Link } from "@nextui-org/react";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react';

const UserComponent = () => {
	const settings = useStore(userSettings);
	return (
		<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar showFallback src={'https://ui-avatars.com/api/?background=random&name=' + settings.username} />
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">{settings.email}</p>
							</DropdownItem>
							<DropdownItem key="dashboard" as={Link} href="/profile/dashboard" className="text-black">
								Dashboard
							</DropdownItem>
							{
								(settings.type == "teacher") || (settings.type == "dual") ? (
									<DropdownItem key="team_settings">Create Exam</DropdownItem>) : null
							}
							{
								(settings.type == "student") || (settings.type == "dual") ? (
									<DropdownItem key="analytics"> Attempt Exam </DropdownItem>
								) : null
							}
							<DropdownItem key="logout" color="danger" as={Link} href="/signout" className="text-black">
								Log Out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
	)
}

export default UserComponent;