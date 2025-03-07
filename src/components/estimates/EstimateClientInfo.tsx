
import { MailIcon, PhoneIcon } from "lucide-react";

interface EstimateClientInfoProps {
  email: string;
  phone: string;
}

const EstimateClientInfo = ({ email, phone }: EstimateClientInfoProps) => {
  return (
    <div className="text-sm space-y-2">
      <div className="flex items-center gap-2">
        <MailIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{email}</span>
      </div>
      <div className="flex items-center gap-2">
        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{phone}</span>
      </div>
    </div>
  );
};

export default EstimateClientInfo;
