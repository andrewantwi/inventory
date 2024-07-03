type CardProps = {
  items: string;
  number: number | undefined;
};

const Card: React.FC<CardProps> = ({ items, number }) => {
  return (
    <div className="card w-44 bg-white text-primary-content mx-2 shadow-lg">
      <div className="card-body flex flex-col items-center justify-center py-5">
        <h2 className="card-title text-[#11403B] text-2xl">{number}</h2>
        <div className="text-[#04D9B2]">Qty</div>
        <div className="card-actions text-sm">{items}</div>
      </div>
    </div>
  );
};

export default Card;
