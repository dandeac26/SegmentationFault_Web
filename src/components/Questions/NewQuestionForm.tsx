import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "@/firebase/clientApp";
import TabItem from "./TabItem";
import { questionState } from "@/atoms/questionsAtom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";

const formTabs = [
  {
    title: "Question",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
];

type NewQuestionFormProps = {
  user: User;
};

const NewQuestionForm: React.FC<NewQuestionFormProps> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setQuestionItems = useSetRecoilState(questionState);

  const handleCreateQuestion = async () => {
    setLoading(true);
    const { title, body, tags } = textInputs;
    try {
      // const questionDocRef = await addDoc(collection(firestore, "questions"), {
      //   creatorId: user.uid,
      //   userDisplayText: user.email!.split("@")[0],
      //   title,
      //   body,
      //   numberOfComments: 0,
      //   voteStatus: 0,
      //   createdAt: serverTimestamp(),
      //   editedAt: serverTimestamp(),
      // });

      //console.log("HERE IS NEW POST ID", questionDocRef.id);

      // // check if selectedFile exists, if it does, do image processing
      // if (selectedFile) {
      //   const imageRef = ref(storage, `questions/${questionDocRef.id}/image`);
      //   await uploadString(imageRef, selectedFile, "data_url");
      //   const downloadURL = await getDownloadURL(imageRef);
      //   await updateDoc(questionDocRef, {
      //     imageURL: downloadURL,
      //   });
      //   console.log("HERE IS DOWNLOAD URL", downloadURL);
      // }

      //Clear the cache to cause a refetch of the questions
      setQuestionItems((prev) => ({
        ...prev,
        questionUpdateRequired: true,
      }));
      router.back();
    } catch (error) {
      console.log("createQuestion error", error);
      setError("Error creating question");
    }
    setLoading(false);
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="brand.900" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Question" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreateQuestion={handleCreateQuestion}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectImage}
          />
        )}
      </Flex>
    </Flex>
  );
};
export default NewQuestionForm;
