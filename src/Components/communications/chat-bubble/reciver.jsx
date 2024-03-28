import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function reciver(props) {
  const formattedDate = formatDistanceToNow(new Date(props.date), { addSuffix: true });
  return (
    <div style={{ maxWidth: '70%' }}>
      <div className="receiver_msg">
        {props.msg && (
          <p className="black fs-sm fw-400 m-0">{props.msg}</p>
        )}
        {props.images && props.images.length > 0 && (
          <div>
            {props.images.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index}`} style={{ maxWidth: '100px' }} />
            ))}
          </div>
        )}
      </div>
      <p className="fs-xxs fw-400 black mt-2">{formattedDate}</p>
    </div>
  );

}
