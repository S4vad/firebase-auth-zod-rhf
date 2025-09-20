#Firebase auth with  react hook form and Zod for validation

Make sure to create firebase config page 

```bash
npm install firebase react-hook-form @hookform/resolvers zod react-router-dom
npm install -D @types/react @types/react-dom typescript
``` 


##Zod Validation Schemas (src/schemas/auth.ts)

```bash
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;


```


##Login page example

```bash
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth';

function Login() {
  const {
    register,        // Register input fields
    handleSubmit,    // Handle form submission
    formState: { errors }, // Access validation errors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Connect Zod schema
    mode: 'onChange', // Optional: validate on change
  });

  async function onSubmit(data: LoginFormData) {
    try {
      // data is fully typed and validated
      console.log('Form data:', data);
      // Handle login logic here
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')} // Register the field
          type="email"
          className={errors.email ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register('password')}
          type="password"
          className={errors.password ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button type="submit">Login</button>
    </form>
  );
}

```

## example of Context 

```bash
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
  type UserCredential,
} from "firebase/auth";

import { auth, googleProvider } from "../config/firebase";
import type { AuthContextType, AuthProviderProps } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  async function signup(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(auth, googleProvider);
  }

  async function logout(): Promise<void> {
    return signOut(auth);
  }

  async function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

```

### we can take  userId and also store this id on database

```bash

function SomeComponent() {
  const { currentUser } = useAuth();
  
  // Get the Firebase UID
  const firebaseUid = currentUser?.uid;
  
  console.log('Firebase UID:', firebaseUid);
  
  return <div>User ID: {firebaseUid}</div>;
}
```



