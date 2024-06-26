import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { RiEyeLine } from '@remixicon/react';

import { getProjectByIdAtom, inviteUserToProjectAtom } from '~/store/project';
import { getOtherUsersAtom } from '~/store/user';
import Button from '~/components/Button';
import { useSelection } from '~/utils/selection';

type InviteUserModalProps = {
  onClose: () => void;
};

const InviteUserModal = ({ onClose }: InviteUserModalProps) => {
  const [{ data: projectData, refetch }] = useAtom(getProjectByIdAtom);
  const [{ data: usersData }] = useAtom(getOtherUsersAtom);
  const [{ mutateAsync: inviteUserToProjectMutate }] = useAtom(
    inviteUserToProjectAtom
  );

  const [usersGettingInvited, toggleUsersGettingInvited, setInitialUsers] =
    useSelection<string>([]);

  const project = useMemo(() => projectData?.data ?? null, [projectData]);
  const usersList = useMemo(() => usersData?.data ?? null, [usersData]);

  useEffect(() => {
    setInitialUsers(project?.collaborators ?? []);
  }, [project]);

  const handleSave = async () => {
    await inviteUserToProjectMutate(usersGettingInvited);
    await refetch();
    onClose();
  };

  return (
    <div className="pt-2">
      {usersList?.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between gap-4 py-2"
        >
          <div className="flex gap-2 items-center">
            {project?.collaborators?.includes(user._id) && (
              <RiEyeLine className="text-green-500" />
            )}
            <p className="text-lg">{user.name}</p>
          </div>

          {!usersGettingInvited.includes(user._id) ? (
            <Button onClick={() => toggleUsersGettingInvited(user._id)}>
              Invite
            </Button>
          ) : (
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={() => toggleUsersGettingInvited(user._id)}
            >
              Cancel Invite
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-end border-t border-gray-200 pt-2">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default InviteUserModal;
