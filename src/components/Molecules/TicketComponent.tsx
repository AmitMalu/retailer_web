import { CommentSvgIcon, UserCardSvgIcon } from "@/assets/svg";
import { useTheme } from "@mui/material";
import TextComponent from "../Atoms/TextComponent";

const TicketComponent = ({
  name,
  id,
  subject,
  description,
  status,
  createdDate,
}: {
  name: string;
  id: string;
  subject: string;
  description: string;
  status: string;
  createdDate: string;
}) => {
  const theme = useTheme();
  return (
    <div className="mb-2 flex w-full items-center justify-between ">
      <div className="flex items-center justify-center w-1/6">
        <UserCardSvgIcon color={theme.palette.gray.DEFAULT} />
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          {name}
        </TextComponent>
      </div>
      <div className="flex items-center justify-center w-1/6">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          {id}
        </TextComponent>
      </div>
      <div className=" flex items-center justify-center w-1/3">
        <CommentSvgIcon
          color={theme.palette.gray.DEFAULT}
          tickColor={theme.palette.primary.main}
        />
        <div>
          <TextComponent
            fontSize={18}
            fontWeight={500}
            color={theme.palette.gray.DEFAULT}
            truncate={true}
            lineClamp={1}
            className="w-[70%]"
          >
            {subject}
          </TextComponent>
          <TextComponent
            fontSize={18}
            fontWeight={500}
            color={theme.palette.gray.dark}
            truncate={true}
            lineClamp={1}
            className="w-[90%]"
          >
            {description}
          </TextComponent>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/12">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          {status}
        </TextComponent>
      </div>
      <div className="flex items-center justify-center w-1/4 ">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          {createdDate}
        </TextComponent>
      </div>
    </div>
  );
};

export default TicketComponent;
