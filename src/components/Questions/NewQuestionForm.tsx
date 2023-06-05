import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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

import { User } from "@/pages/userContext";

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

    // var tagText = "";

    // const setTags = (e) => {
    //   tagText = e.target.value;
    // };


    
    
    // const handleCreateQuestion = async () => {
    //   setLoading(true);

    //   const { title, body, tags } = textInputs;
    //   // var tagsArray = tagText.split(",").map((tag) => tag.trim());
    //   const tagsArray = tags.split(",").map((tag) => tag.trim());


    //   const questionData = {
    //     title,
    //     body,
    //     tags : tagsArray,
    //     votes: 0,
    //     creation_time: serverTimestamp(),
    //     picture: selectedFile, // Assign the Base64 string directly
    //     author_id: "", // Placeholder for user ID
    //     author: "", // Placeholder for author name
    //   };

    //   const response = await fetch(`http://localhost:8080/users/getByEmail?email=${encodeURIComponent(user.email!)}`);
    //   const data = await response.json();
    //   // make sure data is not null
    //   if (data === null) {
    //     console.log("data is null");
    //     return;
    //   }


    //   console.log(data);
    //   if (data && data.userId && data.email) {
    //     questionData.author_id = data.userId; // Assign the user ID from the response
    //     questionData.author = data.email.split("@")[0]; // Assign the author name
    //   }

    //   try {
    //     const response = await fetch("http://localhost:8080/questions/create", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(questionData),
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     if (data.status === "ok") {
    //       // Clear the cache to cause a refetch of the questions
    //       setQuestionItems((prev) => ({
    //         ...prev,
    //         questionUpdateRequired: true,
    //       }));
    //       router.back();
    //     }
    //   } catch (error) {
    //     console.log("createQuestion error", error);
    //     setError("Error creating question");
    //   }


    //   setLoading(false);

    //   // go to index.tsx
    //   router.push("/");
    // };

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
      let questionData: { id?: string | number, title: string, body: string, tags: string[], votes: number, creation_time: string, picture: string | undefined, author_id: string, author: string } = {
        title,
        body,
        tags: tagsArray,
        votes: 0,
        creation_time: new Date().toISOString(),
        picture: selectedFile,
        author_id: "",
        author: "",
    };
    
      const response = await fetch(`http://localhost:8080/users/getByEmail?email=${encodeURIComponent(user.email!)}`);
      const data = await response.json();
      if (data === null) {
        console.log("data is null");
        return;
      }
    
      if (data && data.userId && data.email) {
        questionData.author_id = data.userId;
        questionData.author = data.email.split("@")[0];
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


/*
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
*/

// const handleCreateQuestion = async () => {
    //   setLoading(true);
    
    //   // Convert selectedFile to a byte array
    //   const selectedFileByteArray = selectedFile?.split(",").map((item) => parseInt(item));
      
    //   // Convert byte array to Base64 string
    //   const selectedFileBase64 = btoa(String.fromCharCode.apply(null, selectedFileByteArray!));

    //   const response = await fetch(`http://localhost:8080/users/getByEmail?email=${encodeURIComponent(user.email!)}`);

    //   const data = await response.json();

    //   console.log(data);
    //   if (data.status === "ok") {
    //     // Clear the cache to cause a refetch of the questions
    //     setQuestionItems((prev) => ({
    //       ...prev,
    //       questionUpdateRequired: true,
    //     }));
    //     router.back();
    //   }
    
    //   const { title, body, tags } = textInputs;
    //   const tagsArray = tags.split(",").map((tag) => tag.trim());
    //   const questionData = {
    //     author_id: data.userId,
    //     author: user.email!.split("@")[0],
    //     title,
    //     body,
    //     tags: tagsArray,
    //     votes: 0,
    //     creation_time: serverTimestamp(),
    //     picture: selectedFileBase64, // Assign the Base64 string
    
    //   };
    
    //   try {
    //     const response = await fetch("http://localhost:8080/questions/create", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(questionData),
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     if (data.status === "ok") {
    //       // Clear the cache to cause a refetch of the questions
    //       setQuestionItems((prev) => ({
    //         ...prev,
    //         questionUpdateRequired: true,
    //       }));
    //       router.back();
    //     }
    //   } catch (error) {
    //     console.log("createQuestion error", error);
    //     setError("Error creating question");
    //   }
    
    //   setLoading(false);
    // };

     // try {
      //   const response = await fetch(`http://localhost:8080/questions/getById`);
      //   console.log(response);
      //   // const response = await fetch(`http://localhost:8080/questions/getById?questionId=${questionId}`);

      //   if (response.ok) {
      //     const pictureData = await response.blob();
      //     const pictureUrl = URL.createObjectURL(pictureData);
      //     // Use the pictureUrl to display the image in your frontend (e.g., set it as the source of an <img> tag)
      //   } else {
      //     // Handle the case where the picture retrieval failed (e.g., show a placeholder image)
      //   }
      // } catch (error) {
      //   // Handle any errors that occurred during the request
      // }