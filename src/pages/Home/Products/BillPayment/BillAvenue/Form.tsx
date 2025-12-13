import React from "react";

interface Props {
  serviceName: string;
  subProductId: string;
  vendor: string;
}

const Form: React.FC<Props> = ({ serviceName, subProductId, vendor }) => {
  console.log(serviceName, subProductId, vendor);

  return (
    <div>
      Avenue
    </div>
  )
}

export default Form
