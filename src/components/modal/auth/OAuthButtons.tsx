import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp'


const OAuthButtons:React.FC = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button 
            variant="oauth"
            mb={2} 
            isLoading={loading} 
            onClick={()=> signInWithGoogle()}
            _hover={{
                bg:"#f6f6f6",
            }}
            >
                <Image src="/images/googlelogo.png" height="20px" mr={4}/>
                Continue with Google
            </Button>
        </Flex>
    )
}
export default OAuthButtons;