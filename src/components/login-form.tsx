import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  username: z.string({
    required_error: 'Name is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  })
  // .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => { } }: LoginFormProps) => {
  const { handleSubmit, control, formState } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { isSubmitting } = formState

  useEffect(() => {
    console.log("isSubmitting", isSubmitting);
  }, [isSubmitting])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Sign In
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Welcome! 👋 This is a login screen!
          </Text>
        </View>

        <ControlledInput
          testID="name"
          control={control}
          name="username"
          label="Username"
          disabled={isSubmitting}
        />

        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          placeholder="**********"
          secureTextEntry={true}
          disabled={isSubmitting}
        />
        <Button
          testID="login-button"
          label="Login"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
