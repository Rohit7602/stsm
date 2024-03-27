import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function reciver(props) {
  const formattedDate = formatDistanceToNow(new Date(props.date), { addSuffix: true });
  return (
    <div style={{ maxWidth: '70%' }}>
      <div className="reciver_msg">
        <p className=" black fs-sm fw-400 m-0">{props.msg}</p>
      </div>
      <p className="fs-xxs fw-400 black mt-2">{formattedDate}</p>
    </div>
  );
}
