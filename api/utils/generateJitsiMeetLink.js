export const generateJitsiMeetLink = () => {
  const jitsiMeetUrl = "https://meet.jit.si";
  const roomName = generateRandomRoomName();
  return `${jitsiMeetUrl}/${roomName}`;
};

const generateRandomRoomName = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomName = "MediClinic";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomName += characters.charAt(randomIndex);
  }
  return roomName;
};
