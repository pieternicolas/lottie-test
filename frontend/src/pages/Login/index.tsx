import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';

import TextInput from '~/components/TextInput';
import { currentUserAtom } from '~/store/auth';

import { loginDefaultValues, loginSchema } from './form';

const Login = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    setCurrentUser(data.name);
  });

  return (
    <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center items-center">
      <div className="w-1/2 max-w-[500px] bg-white rounded-lg py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">Hi there!</h1>
        <p className="mb-4">Please enter your name to continue</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <TextInput
                name="name"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )}
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
