import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  VStack,
  Button,
  Input,
  HStack,
} from "@chakra-ui/react";
import Message from "./Components/Message";
import { app } from "./firebase";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
};

const logoutHandler = () => signOut(auth);

function App() {
  const divForScroll = useRef(null);
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Message"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      divForScroll.current.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Message"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <Box bg={"red.100"}>
      {user ? (
        <Container h={"100vh"} bg={"white"} paddingY={"4"}>
          <VStack h={"full"}>
            <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
              Logout
            </Button>

            <VStack
              h="full"
              w={"full"}
              overflowY="auto"
              css={{ "&::-webkit-scrollbar": { display: "none" } }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                />
                <Button colorScheme={"purple"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack justifyContent={"center"} h="100vh">
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Sign In with Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
