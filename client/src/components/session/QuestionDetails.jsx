import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export default function QuestionDetails({ image, prompt, timeInSecs}) {
  return (
    <Box
      sx={{
        display: 'flex',  
        flexDirection: 'column',
      }}
    >
      <img
        src={image} 
        alt="question 1"
        width="100%"
      />
      <Typography component="h4" variant="h6" textAlign='center'>
        <b>{prompt}</b>
      </Typography>
      <Typography component="span" textAlign='center'>
        {timeInSecs}
      </Typography>
    </Box>
  )
}
