// Communications API configuration and utilities

export interface CommunicationsConfig {
  baseUrl: string;
  token: string;
  userId: number;
}

export interface Conversation {
  id: string;
  name?: string;
  type: "dm" | "team" | "judges";
  participants?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  created_at: string;
  conversation_id: string;
}

export interface CreateDMRequest {
  user_id: number;
}

export interface CreateJudgesConversationRequest {
  hackathon_id: number;
  include_organizers?: boolean;
  include_org_members?: boolean;
}

export interface CreateTeamConversationRequest {
  team_id: number;
}

export interface SendMessageRequest {
  content: string;
}

// API Client class for communications
export class CommunicationsAPI {
  private config: CommunicationsConfig;

  constructor(config: CommunicationsConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl.replace(/\/$/, "")}${endpoint}`;

    // Debug logging (disabled to reduce console spam)
    // console.log("API Request Debug:", {
    //   endpoint,
    //   baseUrl: this.config.baseUrl,
    //   token: this.config.token
    //     ? `${this.config.token.substring(0, 20)}...`
    //     : "NO TOKEN",
    //   fullUrl: url,
    // });

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.error("API Error:", { // Disabled to reduce console spam
      //   status: response.status,
      //   statusText: response.statusText,
      //   errorText,
      //   endpoint,
      //   token: this.config.token
      //     ? `${this.config.token.substring(0, 20)}...`
      //     : "NO TOKEN",
      // });
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // Get all conversations for the user
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>("/communications/conversations/");
  }

  // Get a specific conversation
  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request<Conversation>(
      `/communications/conversations/${conversationId}/`
    );
  }

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.request<Message[]>(
      `/communications/conversations/${conversationId}/messages/`
    );
  }

  // Send a message
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return this.request<Message>(
      `/communications/conversations/${conversationId}/messages/`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      }
    );
  }

  // Create or find DM conversation
  async createOrFindDM(targetUserId: number): Promise<Conversation> {
    return this.request<Conversation>("/communications/conversations/dm/", {
      method: "POST",
      body: JSON.stringify({ user_id: targetUserId }),
    });
  }

  // Create or find judges conversation
  async createOrFindJudgesConversation(
    hackathonId: number,
    includeOrganizers = true,
    includeOrgMembers = true
  ): Promise<Conversation> {
    return this.request<Conversation>("/communications/conversations/judges/", {
      method: "POST",
      body: JSON.stringify({
        hackathon_id: hackathonId,
        include_organizers: includeOrganizers,
        include_org_members: includeOrgMembers,
      }),
    });
  }

  // Create or find team conversation
  async createOrFindTeamConversation(teamId: number): Promise<Conversation> {
    return this.request<Conversation>("/communications/conversations/team/", {
      method: "POST",
      body: JSON.stringify({ team_id: teamId }),
    });
  }

  // Update conversation
  async updateConversation(
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    return this.request<Conversation>(
      `/api/v1/communications/conversations/${conversationId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    await this.request(
      `/api/v1/communications/conversations/${conversationId}/`,
      {
        method: "DELETE",
      }
    );
  }
}

// Utility functions
export const getWebSocketUrl = (
  baseUrl: string,
  conversationId: string,
  token: string
): string => {
  const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
  const host = baseUrl.replace(/^https?:\/\//, "");
  return `${wsProtocol}://${host}/communications/conversations/${conversationId}/?token=${encodeURIComponent(
    token
  )}`;
};

export const decodeJWTUserId = (token: string): number | null => {
  try {
    const payloadB64 = token.split(".")[1];
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const data = JSON.parse(json);
    return data.user_id || null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payloadB64 = token.split(".")[1];
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const data = JSON.parse(json);
    const exp = data.exp;
    return exp ? Date.now() >= exp * 1000 : true;
  } catch {
    return true;
  }
};

// Default configuration
export const getDefaultConfig = (): CommunicationsConfig => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1";

  // Try to get token from auth store first, then fallback to localStorage
  let token = "";
  let userId = 0;

  if (typeof window !== "undefined") {
    // Try auth store first
    try {
      const authStore = JSON.parse(
        localStorage.getItem("auth-storage") || "{}"
      );
      if (authStore?.state?.token) {
        token = authStore.state.token;
        userId = authStore.state.userId || 0;
      }
    } catch (e) {
      console.log("Auth store not found, trying localStorage");
    }

    // Fallback to localStorage
    if (!token) {
      token = localStorage.getItem("access_token") || "";
      userId = parseInt(localStorage.getItem("user_id") || "0", 10);
    }
  }

  console.log("getDefaultConfig Debug:", {
    token: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    userId,
    baseUrl,
  });

  return { baseUrl, token, userId };
};
