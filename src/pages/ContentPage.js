import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  CardActions,
  Box,
  TextareaAutosize,
} from '@mui/material';
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../service/firebase-config';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  height: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ContentPage() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState({});
  const [privacy, setPrivacy] = useState({});
  const [payload, setPayload] = useState({ privacypolicy: '', termscondition: '' });

  const handleClose = () => setOpen(false);

  const handlePrivacy = () => {
    setOpen(true);
    setPayload({ privacypolicy: privacy.privacypolicy, termscondition: '' });
  };

  const handleTerms = () => {
    setOpen(true);
    setPayload({ privacypolicy: '', termscondition: terms.termscondition });
  };

  const handlePayloadUpdate = (e) => {
    if (payload.termscondition !== '') {
      setPayload({ termscondition: e.target.value, privacypolicy: '' });
    } else {
      setPayload({ termscondition: '', privacypolicy: e.target.value });
    }
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "content"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.type === "terms") {
        setTerms({ ...data, id: doc.id });
      } else if (data.type === "privacy") {
        setPrivacy({ ...data, id: doc.id });
      }
    });
  };

  const updateContent = async () => {
    try {
      let docRef;
      if (payload.termscondition !== '') {
        if (terms.id) {
          // Update existing Terms document
          docRef = doc(db, "content", terms.id);
          await updateDoc(docRef, { termscondition: payload.termscondition });
        } else {
          // Add new Terms document
          docRef = doc(collection(db, "content"));
          await setDoc(docRef, { type: "terms", termscondition: payload.termscondition });
        }
      } else if (payload.privacypolicy !== '') {
        if (privacy.id) {
          // Update existing Privacy document
          docRef = doc(db, "content", privacy.id);
          await updateDoc(docRef, { privacypolicy: payload.privacypolicy });
        } else {
          // Add new Privacy document
          docRef = doc(collection(db, "content"));
          await setDoc(docRef, { type: "privacy", privacypolicy: payload.privacypolicy });
        }
      }
  
      setOpen(false);
      setPayload({ privacypolicy: '', termscondition: '' });
      getData(); // Refresh the data after update
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    }
  };
  

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Content
      </Typography>

      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="body2">{terms.termscondition}</Typography>
        </CardContent>
        <CardActions sx={{ float: 'right' }}>
          <Button size="large" onClick={handleTerms}>
            Edit Terms And Condition
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2">{privacy.privacypolicy}</Typography>
        </CardContent>
        <CardActions sx={{ float: 'right' }}>
          <Button size="large" onClick={handlePrivacy}>
            Edit Privacy Policy
          </Button>
        </CardActions>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {payload.privacypolicy !== '' ? 'Privacy Policy' : 'Terms and Conditions'}
          </Typography>
          <TextareaAutosize
            placeholder={payload.privacypolicy !== '' ? 'Privacy Policy' : 'Terms and Conditions'}
            onChange={handlePayloadUpdate}
            style={{
              width: '90%',
              height: 'auto',
              border: '1px solid blue',
              borderRadius: 20,
              padding: '6px',
              marginTop: '10px',
            }}
            rows={12}
            value={payload.privacypolicy !== '' ? payload.privacypolicy : payload.termscondition}
          />
          <Button onClick={updateContent}>Update</Button>
        </Box>
      </Modal>
    </>
  );
}
