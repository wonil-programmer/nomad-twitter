import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Form,
  ErrorMessage,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

interface IAccountCreationValues {
  name: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IAccountCreationValues>();

  const handleAccountCreationSubmit: SubmitHandler<
    IAccountCreationValues
  > = async ({ name, email, password }) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, { displayName: name });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);

        if (e.code == "auth/email-already-in-use") {
          setError("email", { type: "existingEmail", message: e.message });
        }
        if (e.code == "auth/weak-password") {
          setError("password", { type: "invalidPwd", message: e.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form
        autoComplete="off"
        onSubmit={handleSubmit(handleAccountCreationSubmit)}
      >
        <Input
          id="name"
          placeholder="Name"
          type="text"
          {...register("name", {
            required: { value: true, message: "이름을 입력해주세요." },
          })}
        />
        {errors?.name && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
        <Input
          id="email"
          placeholder="Email"
          type="email"
          {...register("email", {
            required: { value: true, message: "이메일을 입력해주세요." },
          })}
        />
        {errors?.email?.message && errors?.email?.type === "required" && (
          <ErrorMessage>{errors?.email?.message}</ErrorMessage>
        )}
        {errors?.email?.message && errors?.email?.type === "existingEmail" && (
          <ErrorMessage>{errors?.email?.message}</ErrorMessage>
        )}
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register("password", {
            required: { value: true, message: "비밀번호를 입력해주세요." },
          })}
        />
        {errors?.password?.message && errors?.password?.type === "required" && (
          <ErrorMessage>{errors?.password?.message}</ErrorMessage>
        )}
        {errors?.password?.message &&
          errors?.password?.type === "invalidPwd" && (
            <ErrorMessage>{errors?.password?.message}</ErrorMessage>
          )}
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
