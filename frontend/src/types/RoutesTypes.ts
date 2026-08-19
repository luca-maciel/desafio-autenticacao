export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;

  ForgotPassword: undefined;

  VerifyCode: {
    email: string;
  };

  ResetPassword: {
    email: string;
    code: string;
  };

  VerifyPageRegister: {
  email: string;
  
  };
};