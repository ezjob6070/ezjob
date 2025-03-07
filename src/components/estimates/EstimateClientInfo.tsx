
import { MailIcon, PhoneIcon } from "lucide-react";

interface EstimateClientInfoProps {
  email: string;
  phone: string;
  name?: string;
  address?: string;
}

const EstimateClientInfo = ({ email, phone, name, address }: EstimateClientInfoProps) => {
  return (
    <div className="text-sm space-y-2">
      {name && <p className="font-medium">{name}</p>}
      {address && <p className="text-muted-foreground">{address}</p>}
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
