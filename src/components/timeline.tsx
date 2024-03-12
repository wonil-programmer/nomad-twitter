import styled from "styled-components";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Tweet from "./tweet";

const Wrapper = styled.div``;

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { photo, tweet, userId, username, createdAt } = doc.data();
      return {
        photo,
        tweet,
        userId,
        username,
        createdAt,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
