import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

interface ITweetValues {
  tweet: string;
}

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<ITweetValues>();
  const [file, setFile] = useState<File | null>(null);
  const onTweetSubmit: SubmitHandler<ITweetValues> = async ({ tweet }) => {
    if (isLoading) return;
    const user = auth.currentUser;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user?.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user?.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length === 1) {
      if (files[0].size > MAX_ATTACHMENT_SIZE) {
        alert("첨부 파일 최대 크기는 5MB입니다.");
        return;
      }
      setFile(files[0]);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onTweetSubmit)}>
      <TextArea
        required
        rows={5}
        placeholder="What is happening?"
        {...register("tweet", { required: true, maxLength: 180 })}
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        id="file"
        type="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
