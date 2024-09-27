import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Collapse,
  Flex,
  Textarea,
  IconButton,
  useDisclosure,
  useMediaQuery,
  useToast,
  Image


} from '@chakra-ui/react';


import { useNavigate } from 'react-router-dom';

import { ChevronDownIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';

const ApiTester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [path, setPath] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [authHeaders, setAuthHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] =  useState('');

  const [openSection, setOpenSection] = useState(null); // To track which section is open
  const [isMobile] = useMediaQuery("(max-width: 468px)");

  

  const addRow = (section, setSection) => {
    setSection([...section, { key: '', value: '' }]);
  };

  const removeRow = (index, section, setSection) => {
    const updatedSection = section.filter((_, i) => i !== index);
    setSection(updatedSection);
  };

  const handleInputChange = (index, field, value, section, setSection) => {
    const updatedSection = [...section];
    updatedSection[index][field] = value;
    setSection(updatedSection);
  };

  // Helper function to convert key-value pairs into an object
  const convertToObj = (arr) =>
    arr.reduce((acc, { key, value }) => (key ? { ...acc, [key]: value } : acc), {});

  
    const handleUrlChange = (e) => {
      const newUrl = e.target.value;
      setUrl(newUrl);
    
      try {
        // Extract path from URL
        const urlObject = new URL(newUrl);
        const pathName = urlObject.pathname;
        setPath(pathName); // Set the extracted path
      } catch (err) {
        setError('Invalid URL');
      }
    };

    const handleApiCall = async () => {
      setResponse(null);
      setError(null);
  
      const headersObj = convertToObj(headers);
      const authHeadersObj = convertToObj(authHeaders);
  
      let bodyObj;
      try {
          if (method !== 'GET' && body) {
              bodyObj = JSON.parse(body);
          }
      } catch (err) {
          setError('Invalid JSON body: ' + err.message);
          return;
      }
  
      const trimmedUrl = url.trim();
      const proxyUrl = `https://apiloomback-production.up.railway.app/api`; // No path to avoid redirect issue
  
      if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
          setError("Please provide a valid URL starting with 'http://' or 'https://'");
          return;
      }
  
      const finalUrl = `${proxyUrl}?url=${encodeURIComponent(trimmedUrl)}`;
  
      const options = {
          method: method,
          headers: {
              'Content-Type': 'application/json',
              ...headersObj,
              ...authHeadersObj,
          },
          body: method !== 'GET' ? JSON.stringify(bodyObj) : undefined,
      };
  
      try {
          const res = await fetch(finalUrl, options);
          console.log(res)
          if (!res.ok) {
              throw new Error(` status: ${res.status} , 
  message: ${res.statusText} `);
              
          }
         
          const data = await res.json();
          setResponse(data);
          
      } catch (err) {
          setError('Error: ' + err.message);
          
      }
  };
  
  
  
  
  
    

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const JsonRenderer = ({ response }) => {
    const toast = useToast();
    const [fontSize, setFontSize] = useState('small');
    const [fontWeight, setFontWeight] = useState('600');
  
    const renderJson = (data) => {
      if (Array.isArray(data)) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', fontSize, fontWeight }}>
            {'['}
            {data.map((item, index) => (
              <div key={index} style={{ marginLeft: '20px', marginBottom: '5px' }}>
                {renderJson(item)}
                {index < data.length - 1 && <span style={{ marginLeft: '5px' }}>,</span>}
              </div>
            ))}
            {']'}
          </div>
        );

      }
      
    
      return (
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', marginBottom: '10px' }}>
          {'{'}
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '20px' }}>
              <span style={{ color: 'crimson', fontWeight: 'bold' }}>{key}:</span>
              <span style={{ color: 'green', marginLeft: '5px' }}>
                {typeof value === 'object' && value !== null ? renderJson(value) : JSON.stringify(value)}
              </span>
              {index < Object.entries(data).length - 1 && (
                <span style={{ marginLeft: '5px', alignSelf: 'flex-start' }}>,</span>
              )}
            </div>
          ))}
          {'}'}
        </div>
      );
    };
    
    
  
    // Function to copy JSON to clipboard
    const copyToClipboard = () => {
      const jsonString = JSON.stringify(response, null, 2);
      navigator.clipboard.writeText(jsonString)
        .then(() => {
          toast({
            title: 'Copied to Clipboard!',
            description: 'The JSON data has been successfully copied.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast({
            title: 'Copy Failed',
            description: 'An error occurred while copying the JSON data.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        });
    };
    const scrollToElement = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
  
  
    return (
      <Box mt={4} width={isMobile?"70%":"100%"} p={4} border="0px" borderColor="gray.200" borderRadius="md" >
        
  
        {/* Controls for font size and copy button */}
        <Box display="flex" flexDirection="row" alignItems="center" mb={2} >
          <Select
            onChange={(e) => setFontSize(e.target.value)}
           
            mr={2}
            defaultValue={'small'}
            fontSize={isMobile?"xx-small":"small"}  
            fontWeight={isMobile?"300":"900"}
            width={isMobile?"130px":"20%"}
            
          >
            <option  value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </Select>
          <Button  width={isMobile?"120px":"20%"}  fontSize={isMobile?"xx-small":"small"}  fontWeight={isMobile?"300":"900"} onClick={copyToClipboard} colorScheme="blue">
            Copy JSON
          </Button>
          <Button width={isMobile?"120px":"20%"}  fontSize={isMobile?"xx-small":"small"}  fontWeight={isMobile?"300":"900"} onClick={() => scrollToElement('#bottomost')} ml={"10px"} bgColor={'black'} color={'white'}>
            <a hre="#bottomost">     Bottom Most</a>
        
          </Button>
        </Box>
        <Text fontWeight="bold" mb={2}>Response:</Text>
  
        {/* Render JSON */}
        <Box overflowX="auto" fontSize={fontSize} fontWeight={fontWeight}>
          {response && renderJson(response)}
        </Box>
      </Box>
    );
  };
  
  return (
    <Container maxW="container.md" mt={10} width={isMobile?"85%":"210%"}  ml={isMobile?"10%":"-15vw"}>
    
      <VStack spacing={4}  width={isMobile?"95%":"70vw"}  >
      <Flex>
       <Image 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LtwervqLAyyD_7nj-oQ0kYCaDlBmbXqyEw&s" 
        alt="API Logo" 
        boxSize="60px" 
        marginTop={"-10px"}// adjust the size as needed
        objectFit="contain"
      />
        <Text color={'green'} fontFamily="'Satisfy', cursive" fontSize="2xl">
      ApiLoom
    </Text>
    
      
       </Flex>
       

       

        <FormControl display="flex" width={isMobile?"85%":"80%"} flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
          <Menu>
            <MenuButton
              border={'0.5px solid black'}
              margin={'5px'}
              width={isMobile ? '50%' : '20%'}
              fontWeight={isMobile ? '900' : '900'}
              fontSize={isMobile ? 'bold' : 'bold'}
              fontFamily={'monospace'}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              {method}
            </MenuButton>
            <MenuList border={'0.5px solid black'}>
              <MenuItem fontFamily={'monospace'} onClick={() => setMethod('GET')} color="green.500">GET</MenuItem>
              <MenuItem fontFamily={'monospace'} onClick={() => setMethod('POST')} color="yellow.500">POST</MenuItem>
              <MenuItem fontFamily={'monospace'} onClick={() => setMethod('PUT')} color="blue.500">PUT</MenuItem>
              <MenuItem fontFamily={'monospace'} onClick={() => setMethod('DELETE')} color="red.500">DELETE</MenuItem>
            </MenuList>
          </Menu>

          <Input
            type="text"
            value={url}
            margin={'5px'}
            onChange={handleUrlChange}
            border={'0.5px solid green'}
            fontFamily={'monospace'}
            placeholder="Enter API URL"
            width={isMobile ? '70%' : '180%'}
            fontWeight={isMobile ? '300' : '900'}
            fontSize={isMobile ? 'small' : 'bold'}
          />

          <Button
            border={'0.5px solid black'}
            fontFamily={'monospace'}
            color={'black'}
            bg={'white'}
            margin={'5px'}
            width={isMobile ? '70%' : '20%'}
            fontWeight={isMobile ? '900' : '900'}
            fontSize={isMobile ? 'bold' : 'bold'}
            onClick={handleApiCall}
          >
            Send
          </Button>
        </FormControl>

        {/* Buttons for Parameters */}
        <Flex justifyContent="space-around" width={isMobile ? '60%' : '100%'} flexWrap="wrap">
          <Button
            fontFamily={'monospace'}
            border={'0.5px solid black'}
            bg={'white'}
            margin={'5px'}
            onClick={() => toggleSection('query')}
            isActive={openSection === 'query'}
            width={isMobile ? '99%' : '20%'}
            fontWeight={isMobile ? '300' : '900'}
            fontSize={isMobile ? 'small' : 'bold'}
          >
            Query 
          </Button>

          <Button
            fontFamily={'monospace'}
            border={'0.5px solid black'}
            bg={'white'}
            margin={'5px'}
            onClick={() => toggleSection('headers')}
            isActive={openSection === 'headers'}
            width={isMobile ? '99%' : '20%'}
            fontWeight={isMobile ? '300' : '900'}
            fontSize={isMobile ? 'small' : 'bold'}
          >
            Headers
          </Button>

          <Button
            fontFamily={'monospace'}
            border={'0.5px solid black'}
            bg={'white'}
            margin={'5px'}
            onClick={() => toggleSection('auth')}
            isActive={openSection === 'auth'}
            width={isMobile ? '99%' : '20%'}
            fontWeight={isMobile ? '300' : '900'}
            fontSize={isMobile ? 'small' : 'bold'}
          >
            Authorization
          </Button>

          <Button
            fontFamily={'monospace'}
            border={'0.5px solid black'}
            bg={'white'}
            margin={'5px'}
            onClick={() => toggleSection('body')}
            isActive={openSection === 'body'}
            width={isMobile ? '99%' : '20%'}
            fontWeight={isMobile ? '300' : '900'}
            fontSize={isMobile ? 'small' : 'bold'}
          >
            Body
          </Button>
        </Flex>

        {/* Collapsible Sections */}
        {/* Query Parameters */}
        <Collapse in={openSection === 'query'}>
          <FormControl mt={2} width={'55vw'}>
            <FormLabel>Query Parameters (Key-Value)</FormLabel>
            {queryParams.map((param, index) => (
              <Flex key={index} mb={2} gap={2}>
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) =>
                    handleInputChange(index, 'key', e.target.value, queryParams, setQueryParams)
                  }
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) =>
                    handleInputChange(index, 'value', e.target.value, queryParams, setQueryParams)
                  }
                />
                <IconButton
                  icon={<CloseIcon />}
                  onClick={() => removeRow(index, queryParams, setQueryParams)}
                  aria-label="Remove Row"
                />
              </Flex>
            ))}
            <Button leftIcon={<AddIcon />} onClick={() => addRow(queryParams, setQueryParams)}>
              Add Parameter
            </Button>
          </FormControl>
        </Collapse>

        {/* Headers */}
        <Collapse in={openSection === 'headers'}>
          <FormControl mt={2} width={'55vw'}>
            <FormLabel>Headers (Key-Value)</FormLabel>
            {headers.map((header, index) => (
              <Flex key={index} mb={2} gap={2}>
                <Input
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) =>
                    handleInputChange(index, 'key', e.target.value, headers, setHeaders)
                  }
                />
                <Input
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    handleInputChange(index, 'value', e.target.value, headers, setHeaders)
                  }
                />
                <IconButton
                  icon={<CloseIcon />}
                  onClick={() => removeRow(index, headers, setHeaders)}
                  aria-label="Remove Row"
                />
              </Flex>
            ))}
            <Button leftIcon={<AddIcon />} onClick={() => addRow(headers, setHeaders)}>
              Add Header
            </Button>
          </FormControl>
        </Collapse>

        {/* Authorization Headers */}
        <Collapse in={openSection === 'auth'}>
          <FormControl mt={2} width={'55vw'}>
            <FormLabel>Authorization Headers (Key-Value)</FormLabel>
            {authHeaders.map((authHeader, index) => (
              <Flex key={index} mb={2} gap={2}>
                <Input
                  placeholder="Key"
                  value={authHeader.key}
                  onChange={(e) =>
                    handleInputChange(index, 'key', e.target.value, authHeaders, setAuthHeaders)
                  }
                />
                <Input
                  placeholder="Value"
                  value={authHeader.value}
                  onChange={(e) =>
                    handleInputChange(index, 'value', e.target.value, authHeaders, setAuthHeaders)
                  }
                />
                <IconButton
                  icon={<CloseIcon />}
                  onClick={() => removeRow(index, authHeaders, setAuthHeaders)}
                  aria-label="Remove Row"
                />
              </Flex>
            ))}
            <Button leftIcon={<AddIcon />} onClick={() => addRow(authHeaders, setAuthHeaders)}>
              Add Auth Header
            </Button>
          </FormControl>
        </Collapse>

        {/* Body */}
        <Collapse in={openSection === 'body'}>
          <FormControl mt={2} width={'55vw'} height={'auto'}>
            <FormLabel>Body</FormLabel>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </FormControl>
        </Collapse>
       

{response && (
  <Box width={isMobile ? '100%' : '80%'}>
  <JsonRenderer response={response} />
  <Box >
    <h5 id="#bottomost"></h5>
  </Box>
  </Box>
)}

{error && (
          <Box mt={4} width={isMobile ? '100%' : '100%'} p={4} border="1px" borderColor="red.200" borderRadius="md">
            <Text fontWeight={isMobile ? '300' : '900'}  mb={2} width={isMobile ? '50%' : '100%'} fontSize={isMobile ? 'small' : 'large'} >
       
              <pre >{error}</pre>
            </Text>
            
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ApiTester;



