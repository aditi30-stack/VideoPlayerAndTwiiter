import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

const defaultImage = "http://res.cloudinary.com/doncgntap/image/upload/v1728926147/vpuvqgzgzmfe4ywyc1yv.webp";

export default function MultiActionAreaCard({ title, description, views, thumbnail }) {

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        
        <div className='h-[180px] w-[280px]'>
         
          <CardMedia
            component="img"
            image={thumbnail}
            alt={title}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            onError={handleImageError}
          />
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          {views} views
        </Button>
      </CardActions>
    </Card>
  );
}
