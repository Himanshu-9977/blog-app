import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserById(userId: string) {
  try {
    // If the userId matches the current user, use currentUser() which is more efficient
    const { userId: currentUserId } = await auth();

    if (userId === currentUserId) {
      const user = await currentUser();
      if (!user) throw new Error("User not found");

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'
      };
    }

    // For other users, we can't fetch them directly in the free tier
    // So we'll return a placeholder
    return {
      id: userId,
      firstName: null,
      lastName: null,
      imageUrl: null,
      username: null,
      fullName: 'Unknown User'
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      id: userId,
      firstName: null,
      lastName: null,
      imageUrl: null,
      username: null,
      fullName: 'Unknown User'
    };
  }
}
