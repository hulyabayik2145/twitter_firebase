import { collection, onSnapshot, query, count } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

const Aside = () => {
  const [tweetCount, setTweetCount] = useState(0);
  useEffect(() => {
    const tweetsCol = collection(db, "tweets");
    const q = query(tweetsCol, count());
    onSnapshot(q, (snapshot) => {
      setTweetCount(snapshot.size);
    });
  }, []);

  return (
    <div className="max-xl:hidden p-4">
      <h1 className="text-xl font-semibold">Gönderi Sayısı : {tweetCount}</h1>
    </div>
  );
};

export default Aside;
