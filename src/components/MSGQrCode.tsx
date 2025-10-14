import { QRCodeSVG } from 'qrcode.react';

interface MSGQrCodeProps {
    size?: number;
    url?: string;
}

const MSGQrCode = ({ 
    size = 100, 
    url = 'https://kalshi.com/markets/kxmayornycparty-25' 
}: MSGQrCodeProps) => {
    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                borderRadius: 8,
            }}
        >
            <QRCodeSVG 
                value={url} 
                size={size - 16}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#000000"
            />
        </div>
    );
};

export default MSGQrCode;

