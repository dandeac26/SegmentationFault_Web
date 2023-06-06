import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
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

import { User, UserContext } from "@/pages/userContext";

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
  question?: any;  // Add this
  isEditMode?: boolean;  // Add this
};

const NewQuestionForm: React.FC<NewQuestionFormProps> = ({ user, question, isEditMode }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
    tags: "",
  });

  useEffect(() => {
  if (question) {
    setTextInputs({
      title: question.title,
      body: question.body,
      tags: question.tags.join(","),
    });
  }
}, [question]); 
  
  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setQuestionItems = useSetRecoilState(questionState);
  const { currentUser } = useContext(UserContext) as { currentUser: User | null };
 

  /**
    java constuctor for question entity : 
    public Question(String author, Long author_id,String title, String body, Date dateTimeFormat, byte[] picture, List<Tag> tags, Long votes) {
        this.author = author;
        this.author_id = author_id;
        this.title = title;
        this.body = body;
        this.date = (Date) dateTimeFormat;
        this.picture = picture;
        this.tags = tags;
        this.votes = votes;
    }
   */

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files![0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        const base64data = reader.result as string;
        setSelectedFile(base64data);
      }
    };


    const handleCreateOrUpdateQuestion = async () => {
      setLoading(true);
      console.log("handleCreateOrUpdateQuestion");
      const { title, body, tags } = textInputs;

      const tagsArray = tags.split(",").map((tag: string) => tag.trim());
      
      // const questionData = {
      //   id,
      //   title,
      //   body,
      //   tags: tagsArray,
      //   votes: 0,
      //   creation_time: serverTimestamp(),
      //   picture: selectedFile,
      //   author_id: "",
      //   author: "",
      // };
      let questionData: { id?: string | number, title: string, body: string, tags: string[], voteStatus: number, creation_time: string, picture: string | undefined, author_id: string, author: string } = {
        title,
        body,
        tags: tagsArray,
        voteStatus: 0,
        creation_time: new Date().toISOString(),
        picture: selectedFile,
        author_id: "",
        author: "",
    };
    
      // const response = await fetch(`http://localhost:8080/users/getByEmail?email=${encodeURIComponent(user.email!)}`);
      // console.log("response", response)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // let data;
      // if (response.status !== 204) {
      //   data = await response.json();
      // } else {
      //   console.log("No content returned from server");
      // }
      // //const data = await response.json();
      // if (data === null) {
      //   console.log("data is null");
      //   return;
      // }
    
      //if (data && data.userId && data.email) {}
      if(currentUser?.id && currentUser.email){
        questionData.author_id = currentUser.id;
        questionData.author = currentUser.email.split("@")[0];
      }
      
    
      let result;
      try {
        if (isEditMode) {
          questionData.id = question.id; // Set the question ID in the request body
          if(questionData.picture === undefined)
            questionData.picture = question.picture; // Set the picture to the existing picture
          result = await fetch(`http://localhost:8080/questions/updateId=${questionData.id}`, { // Use '/' instead of '=' in the URL
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
          });
      }
         else {
          result = await fetch("http://localhost:8080/questions/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionData),
          });
        }
        console.log("question trasnmitted, isEDit", questionData, isEditMode)
        const data = await result.json();
        console.log(data);
        if (data.status === "ok") {
          setQuestionItems((prev) => ({
            ...prev,
            questionUpdateRequired: true,
          }));
          router.back();
        }
      } catch (error) {
        console.log("createQuestion error", error);
        setError("Error creating question");
      }
    
      setLoading(false);
      router.push("/");
    };
    

    

    // const [pictureUrl, setPictureUrl] = useState<string | null>(null);

    // const fetchQuestionPicture = async (questionId: number): Promise<void> => {
    //   const response = await fetch(`http://localhost:8080/questions/getById/${questionId}`);
    //   const blob = await response.blob();
    //   const reader = new FileReader();
    //   reader.readAsDataURL(blob);
    //   reader.onloadend = function() {
    //     const base64data = reader.result as string; // We are sure that result will be string, so we can cast it.
    //     setPictureUrl(base64data);
    //   }
    // };
    
    
    // useEffect(() => {
    //   // Call the fetchQuestionPicture function when the component mounts or when the question ID changes
    //   fetchQuestionPicture(6); // Replace '6' with the actual question ID
    // }, []);
    
    

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
            handleCreateQuestion={handleCreateOrUpdateQuestion}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
            <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={handleFileChange}  // Use handleFileChange instead of onSelectImage
          />
        )}
      </Flex>
      {/* {pictureUrl && <img src={pictureUrl} alt="Question Picture" />} */}


    </Flex>
  );
};
export default NewQuestionForm;

