import { Avatar, Card } from '@mantine/core'
import { useTheme } from '@mui/system';

const DashboardProfileCard = ({ profile }: any) => {
    const hasImage = profile?.image && profile.image.trim() !== "";

    const theme = useTheme();

    return (
        <Card
            shadow="lg"
            padding="lg"
            radius="md"
            style={{ background: theme.palette.red.light, color: theme.palette.red.dark }}
        >
            <div className="flex flex-col items-center">
                <Avatar
                    src={hasImage ? profile.image : null}
                    size={120}
                    radius="md"
                    variant='white'
                    alt={profile.name}
                />
            </div>

            <h1 className='mt-3 font-bold'>{profile.name || "-"}</h1>
            <p className='mt-2 font-semibold'>{profile.retailerId || "-"}</p>

            <div className="flex w-full mt-4">
                <div className="flex-1 text-center border-r border-white/40 py-2">
                    <p className="text-xs font-semibold">PREPAID BALANCE</p>
                    <p className="text-base font-bold">₹ {profile?.prepaid || 0}</p>
                </div>

                <div className="flex-1 text-center py-2">
                    <p className="text-xs font-semibold">POSTPAID BALANCE</p>
                    <p className="text-base font-bold">₹ {profile?.postpaid || 0}</p>
                </div>
            </div>
        </Card >
    )
}

export default DashboardProfileCard
