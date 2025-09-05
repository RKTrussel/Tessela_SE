const CampaignProgress = ({ progress }) => {
  return (
    <div>
      <progress value={progress} max="100"></progress>
      <span> {progress}%</span>
    </div>
  );
};

export default CampaignProgress;