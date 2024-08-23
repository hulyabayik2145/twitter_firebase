import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useState } from "react";
import Loader from "./Loader";

const Form = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  //tweetler kolleksiyonun referansını al
  const tweetsCol = collection(db, "tweets");

  //dosya resimse, resmi storage a yükle  ve resmin url sini
  //fonksiyonu çağrıldığı yere döndür

  const uploadImage = async (file) => {
    console.log(file);

    //1 dosya resim değilse dur
    if (!file || !file.type.startsWith("image")) return null;

    //2 dosya resim ise doyanın yükleneceği konumun referansını al
    const fileRef = ref(storage, v4() + file.name);

    //3  referansını oluşturduğumuz konuma dosyayı yükle
    await uploadBytes(fileRef, file);
    console.log("deneme");

    //4 yüklenen dosyanın urls ,ne eriş ve döndür
    return await getDownloadURL(fileRef);
  };
  //form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault();

    //1) inputlardaki verilere eriş
    // console.dir(e.target);
    const textContent = e.target[0].value;
    const imageContent = e.target[1].files[0];

    //2) yazı ve resim içeriği yok ise uyarı ver
    // console.log(textContent, imageContent);
    if (!textContent && !imageContent) {
      return toast.info("Lütfen içerik giriniz ");
    }

    //yüklenme state ini true ya çek
    setIsLoading(true);

    try {
      //3 resmi storage'a yüksle
      const url = await uploadImage(imageContent);
      console.log(url);

      //4 yeni tweet dökümanını koleksiyona ekle
      await addDoc(tweetsCol, {
        textContent,
        imageContent: url,
        createdAt: serverTimestamp(),
        like: [],
        isEdited: false,
        user: {
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        },
      });
    } catch (err) {
      console.log(err);
    }

    //yüklenme state ini false çek

    setIsLoading(false);

    // formu temizle

    e.target.reset();
  };
  return (
    <form onSubmit={handleSubmit} className="border-b  border-zinc-600 p-4">
      <img
        className="rounded-full h-[35px] md:h-[45px] mt-1"
        src={user?.photoURL}
        alt={user?.displayName}
      />
      <div className="w-full">
        <input
          className="w-full bg-transparent my-2 outline-none md:text-lg"
          type="text"
          placeholder="Neler Oluyor?"
        />
        <div className="flex justify-between items-center">
          <label
            className="text-lg transition p-4 cursor-pointer rounded-full hover:bg-gray-800"
            htmlFor="image"
          >
            <BsCardImage />
          </label>
          <input className="hidden" id="image" type="file" />
          <button
            type="submit"
            className="bg-blue-600 flex items-center justify-center px-4 py-2 min-w-[85px] min-h-[40px] rounded-full transition"
          >
            {isLoading ? (
              <>
                <Loader styles={`!text-white`} />{" "}
                <span className="text-[10px] ms-2">Yükleniyor</span>
              </>
            ) : (
              "Tweetle"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
