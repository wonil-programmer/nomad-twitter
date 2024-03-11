import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IAccountCreationValues>();

  const handleLoginSubmit: SubmitHandler<IAccountCreationValues> = async ({
    email,
    password,
  }) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
        if (e.code == "auth/invalid-login-credentials") {
          setError("password", { type: "invalid", message: e.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log Into X</Title>
      <Form autoComplete="off" onSubmit={handleSubmit(handleLoginSubmit)}>
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
        {errors?.password?.message && errors?.password?.type === "invalid" && (
          <ErrorMessage>{errors?.password?.message}</ErrorMessage>
        )}
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
