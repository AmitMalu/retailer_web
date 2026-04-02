import { Avatar, Card } from '@mantine/core'
import TextComponent from '../Atoms/NewComponents/TextComponent';
import { useTheme } from '@mui/material';

const DashboardProfileCard = ({ profile }: any) => {
    const hasImage = profile?.image && profile.image.trim() !== "";

    const theme = useTheme();

    return (
        <Card
            shadow="lg"
            padding="lg"
            radius="md"
            style={{ 
                background: theme.palette.mode === 'dark' 
                    ? theme.palette.background.paper 
                    : theme.palette.primary.light + "20",
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <div className="flex flex-col items-center">
                <Avatar
                    src={hasImage ? profile?.image : null}
                    size={120}
                    radius="md"
                    // bg="white"
                    alt={profile?.name}
                    styles={{
                        image: {
                            objectFit: "contain",
                            // backgroundColor: "white",
                        },
                    }}
                />
            </div>

            <TextComponent component="div" className='mt-3 font-bold text-lg' color={theme.palette.text.primary}>
                {profile?.name || "-"}
            </TextComponent>
            <TextComponent component="div" className='mt-1 font-semibold' color={theme.palette.text.secondary}>
                {profile?.retailerId || "-"}
            </TextComponent>

            <div className="flex w-full mt-4">
                <div className="flex-1 text-center border-r border-divider py-2">
                    <TextComponent component="p" className="text-xs font-semibold" color={theme.palette.text.secondary}>PREPAID BALANCE</TextComponent>
                    <TextComponent component="p" className="text-base font-bold" color={theme.palette.text.primary}>₹ {profile?.prepaid || 0}</TextComponent>
                </div>

                <div className="flex-1 text-center py-2">
                    <TextComponent component="p" className="text-xs font-semibold" color={theme.palette.text.secondary}>POSTPAID BALANCE</TextComponent>
                    <TextComponent component="p" className="text-base font-bold" color={theme.palette.text.primary}>₹ {profile?.postpaid || 0}</TextComponent>
                </div>
            </div>
        </Card >
    )
}

export default DashboardProfileCard
