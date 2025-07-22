import { CommentSvgIcon, UserCardSvgIcon } from "@/assets/svg";
import { useTheme } from "@mui/material";
import TextComponent from "../Atoms/TextComponent";
import moment from "moment";

const TicketComponent = () => {
  const theme = useTheme();
  return (
    <div className="p-5 mb-4 gap-2 border flex w-full border-gray-light rounded-lg bg-gray-light items-center justify-between ">
      <div className="flex items-center justify-center gap-2 w-1/6 ">
        <UserCardSvgIcon color={theme.palette.gray.DEFAULT} />
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          Name
        </TextComponent>
      </div>
      <div className="flex items-center justify-center gap-2 w-1/6 ">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          id
        </TextComponent>
      </div>
      <div className="gap-2 flex items-center justify-start w-1/3 ">
        <CommentSvgIcon
          color={theme.palette.gray.DEFAULT}
          tickColor={theme.palette.greenColor.DEFAULT}
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
            ticketxsjadjhscn cjabcjsa cn cjabc
          </TextComponent>
          <TextComponent
            fontSize={18}
            fontWeight={500}
            color={theme.palette.gray.dark}
            truncate={true}
            lineClamp={1}
            className="w-[90%]"
          >
            sjdfj cns cjbcnas cjahbc
          </TextComponent>
        </div>
      </div>
      <div className="flex items-center w-1/12 justify-center ">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          status
        </TextComponent>
      </div>
      <div className="flex items-center justify-center w-1/4">
        <TextComponent
          fontSize={18}
          fontWeight={500}
          color={theme.palette.gray.DEFAULT}
        >
          {moment("17-11-2025").format("YYYY-MM-DD")}
        </TextComponent>
      </div>
    </div>
  );
};

export default TicketComponent;
