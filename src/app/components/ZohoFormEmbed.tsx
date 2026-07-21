type ZohoFormEmbedProps = {
  src: string;
  title: string;
  height?: number;
};

export function ZohoFormEmbed({ src, title, height = 700 }: ZohoFormEmbedProps) {
  return (
    <div className="w-full overflow-hidden bg-white">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="block w-full border-0"
        style={{ height }}
        allow="geolocation; microphone; camera"
      />
    </div>
  );
}
