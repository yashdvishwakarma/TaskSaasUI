// src/components/Profile.tsx
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { GetProfile } from "../api/task";
import { useEffect, useState } from "react";

export default  function Profile() {

  
  const user = localStorage.getItem("user");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const localUser = localStorage.getItem("user");
    const parsedUser = localUser ? JSON.parse(localUser) : null;

    const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    try {
      setError("");
      const res = await GetProfile({ UserId: parsedUser?.id });
      setProfile(res.data); // save API response
    } catch (err) {
      console.error(err);
      setError("Failed to load Profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ maxWidth: 500, width: "100%", p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>

          <Typography variant="body1"><b>Name:</b> {profile?.fullName}</Typography>
          <Typography variant="body1"><b>Email:</b> {profile?.email}</Typography>
          <Typography variant="body1"><b>Role:</b> {profile?.role}</Typography>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" color="primary">Edit Profile</Button>
            <Button variant="outlined" color="secondary">Change Password</Button>
            <Button variant="text" color="error">Logout</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
