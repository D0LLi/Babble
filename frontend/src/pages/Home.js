import React from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
const Home = () => {
  return (
    <Container maxW='xl' centerContent className='homePage'>
      <Box
        d='flex'
        p={3}
        justifyContent={'center'}
        bg='white'
        w='100%'
        m='30px 0 10px 0'
        borderRadius='lg'
        borderWidth='1px'
        >
          <Text textAlign='center' fontSize='4xl' fontFamily='red hat display'>BABBLE</Text>
        </Box>
        <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' >
          <Tabs>
            <TabList>
              <Tab w='50%'>Log in</Tab>
              <Tab w='50%'>Sign up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <Signup/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
    </Container>
  )
}

export default Home