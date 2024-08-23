import moment from "moment/moment";
import "moment/locale/tr";
import Buttons from "./Buttons";
import { auth, db } from "../../firebase/config";
import Dropdown from "./Dropdown";
import {
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useState } from "react";
import EditMode from "./EditMode";
import Content from "./Content";
toast;
const Post = ({ tweet }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  ///tarihin gunumuze göre formatlanmış hali
  const date = moment(tweet?.createdAt?.toDate()).fromNow();

  //oturumu açık olan kullanıcı twwetin like dizisinde var mı?

  const isLiked = tweet.like.includes(auth.currentUser.uid);

  //tweeti kaldır
  const handleDelete = async () => {
    //kaldırılacak dökümanın referansını al
    const tweetRef = doc(db, "tweets", tweet.id);
    //dokumanı kaldır
    deleteDoc(tweetRef)
      .then(() => toast.warn("tweet akıştan kaldırıldı"))
      .catch(() => toast.danger("tweet silinirken sorun oluştu"));
  };

  //tweeti likela

  const handleLike = async () => {
    //güncelenecek dökümanın referansını al
    const tweetRef = doc(db, "tweets", tweet.id);
    //belgeyi güncelle
    //likelayan kullanının id sini likes dizisine ekle
    updateDoc(tweetRef, {
      like: isLiked
        ? arrayRemove(auth.currentUser.uid) //aktif kullanıcının like si varsa like kaldır
        : arrayUnion(auth.currentUser.uid), //like yoksa ekle
    });
  };
  console.log(auth.currentUser.uid); //oturumu açık olan kullanıcı
  console.log(tweet.user.id); //tweeti atan kullanıcı
  return (
    <div className=" border-b py-6 px-3 border-zinc-600 flex gap-3">
      <img
        className="w-12 h-12 rounded-full"
        src={tweet.user.photo}
        alt={tweet.user.name}
      />
      <div className=" w-full">
        {/* en üst kısım */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center whitespace-nowrap">
            <p className="font-semibold">{tweet.user.name}</p>
            <p className="text-gray-400 text-sm">
              @{tweet.user.name.toLowerCase().split("").join("_")}
            </p>
            <p className="text-gray-400 items-center">{date}</p>
            {tweet.isEdited && (
              <p className="text-gray-400 text-xm">*düzenlendi</p>
            )}
          </div>

          {tweet.user.id === auth.currentUser.uid && (
            <Dropdown
              handleEdit={() => setIsEditMode(true)}
              handleDelete={handleDelete}
            />
          )}
        </div>
        {/* orta kısım */}

        <div className=" my-4">
          {isEditMode ? (
            <EditMode tweet={tweet} close={() => setIsEditMode(false)} />
          ) : (
            <Content tweet={tweet} />
          )}
        </div>
        {/* alt kısım */}
        <Buttons
          isLiked={isLiked}
          handleLike={handleLike}
          likeCount={tweet.like.length}
        />
      </div>
    </div>
  );
};

export default Post;
