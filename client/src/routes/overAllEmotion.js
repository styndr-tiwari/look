import React , { useState }  from "react";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import styled, { keyframes } from 'styled-components'
import  ImgMediaCard from './card'
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root4: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  
  }));

function barStyle( percentage ){
  const pulse = keyframes`from{
        width: 350px;
    }
    to{
        width: ${percentage*300 + 350}px;
    }`;

    return styled.div`
    border:yellow 2px solid;
    border-radius: 3px;
    font-size : 40px;
    background-color:rgba(42, 148, 197, 0.63);
    width: 200px;
    height: 70px;
    position: relative;
    animation-name: ${pulse};
    animation-duration: 7s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  `;

}

function OverAllEmotion ( props ){
    const classes = useStyles();
    let maxEmotionCalle = 'happy' , maxEmotionCountCalle = 0;
    let maxEmotionCaller = 'happy' , maxEmotionCountCaller = 0;
    var photos ; 

    const [ cards , setcards ] = useState( [ ] );

    photos = localStorage.getItem('photos'); //console.log(photos);
    if( localStorage.getItem('photos') )
    {
        photos = JSON.parse(localStorage.getItem('photos')); //console.log(photos);
        
        var emotionCountOfCaller = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral' : 0};
        var emotionCountOfCalle  = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral' : 0};
        var emotionCount= [ 'angry' , 'disgust' , 'fear' , 'happy' , 'sad' , 'surprise' , 'neutral'  ];
        photos.forEach( photo => {
            // photo => [{state , emoji , baseurl } *2  ]
            emotionCountOfCaller[photo[0].state] += 1;
            emotionCountOfCalle[photo[1].state] += 1;
        });
        
        emotionCount.forEach ( element => { 
            if(  maxEmotionCountCalle < emotionCountOfCalle[element] ) {
                maxEmotionCalle = element;
                maxEmotionCountCalle = emotionCountOfCalle[element];
            }
            if(  maxEmotionCountCaller < emotionCountOfCaller[element] ) {
                maxEmotionCaller = element;
                maxEmotionCountCaller = emotionCountOfCaller[element];
            }   
        });

        // maxEmotionCaller = max( emotionCountOfCaller["angary"] , emotionCountOfCaller["happy"] , emotionCountOfCaller["neutral"]  , emotionCountOfCaller["sad"]);
        let callerPer = (maxEmotionCountCaller/ photos.length ) * 100;
        let callePer = (maxEmotionCountCalle/ photos.length ) * 100;
        var emotionMap={'angry': '😠','disgust': '🤢', 'fear': '😱', 'happy':'😁', 'sad': '☹️', 'surprise': '😮', 'neutral' : '😐'};
        // console.log( emotionMap[maxEmotionCaller] + callerPer );
        
        // book collection for given emotion
        
        var list1=[];

        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${maxEmotionCaller}+inauthor:keyes&key=AIzaSyCuZr0YMzeP9337Lj2zVVeg5ew1C9eUFaw`)
        .then((res)=>{
            let data= res.data.items;
            for(let i=0;i<6;i++)
            {
                let obj={"title":data[i].volumeInfo.title,
                          "author":data[i].volumeInfo.authors[0],
                          "link":data[i].volumeInfo.previewLink,
                          "photo":data[i].volumeInfo.imageLinks,
                            };
                
                list1.push(obj);   
            }
            setcards( list1 );
        })
        .catch((err)=>console.log(err));

      
        //   const Flexbar = styled.div`
        //   display: flex;
        //   flex-direction: row;
        // `;
          
        let SadBar = barStyle( emotionCountOfCaller["sad"]/photos.length );
        let HappyBar = barStyle( emotionCountOfCaller["happy"]/photos.length );
        let NeutralBar = barStyle( emotionCountOfCaller["neutral"]/photos.length );
        let AngryBar = barStyle( emotionCountOfCaller["angry"]/photos.length );
        
        
        return <div> 
            <Grid>
              <Paper className={classes.paper}>
                <br/>
                <HappyBar > Happy 😁 { (emotionCountOfCaller["happy"]/photos.length*100).toFixed(1) }% </HappyBar>
                <NeutralBar> Neutral😐{(emotionCountOfCaller["neutral"]/photos.length*100).toFixed(1) }% </NeutralBar>
                <SadBar > Sad ☹️{(emotionCountOfCaller["sad"]/photos.length*100).toFixed(1) }% </SadBar>
                <AngryBar> Angry 😠{(emotionCountOfCaller["angry"]/photos.length*100).toFixed(1) }% </AngryBar>
                <br/>
              </Paper>
              <Paper className={classes.paper} >
                <h1>Looking very {maxEmotionCaller}!! Here are few books you would prefer to read!</h1>
              <Grid container spacing={3}>
                 < ImgMediaCard items={cards} />
              </Grid>
              </Paper>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={6}> 
                <Paper className={classes.paper}> 
                  <Typography gutterBottom variant="h5" component="h1">{ callerPer }% { emotionMap[maxEmotionCaller] } { maxEmotionCaller } </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}> 
                <Paper className={classes.paper}>
                  <Typography gutterBottom variant="h5" component="h1">{ callePer }% { emotionMap[maxEmotionCalle] }{ maxEmotionCalle } </Typography>
                </Paper>
              </Grid>
            </Grid>
        </div>;
    }
    
    return  <div></div>;
        
};

export default OverAllEmotion;