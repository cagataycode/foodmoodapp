import { useState } from "react";
import {
  validateSignInForm,
  validateSignUpForm,
} from "../services/authService";

export const useSignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return validateSignInForm(email, password);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    validateForm,
    resetForm,
  };
};

export const useSignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return validateSignUpForm(name, email, password);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    validateForm,
    resetForm,
  };
};
