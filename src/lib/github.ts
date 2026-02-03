const REPO_OWNER = "DDEV-Manager";
const REPO_NAME = "ddev-manager";

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
  assets: ReleaseAsset[];
}

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface PlatformDownload {
  label: string;
  url: string;
  filename: string;
  size: number;
}

export interface PlatformDownloads {
  macOS?: PlatformDownload;
  windowsX64?: PlatformDownload;
  windowsArm?: PlatformDownload;
  linuxX64Deb?: PlatformDownload;
  linuxX64AppImage?: PlatformDownload;
  linuxArmDeb?: PlatformDownload;
  linuxArmAppImage?: PlatformDownload;
}

export async function getLatestRelease(): Promise<Release | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DDEV-Manager-Website",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch release: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching release:", error);
    return null;
  }
}

export async function getContributors(limit = 20): Promise<Contributor[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=${limit}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DDEV-Manager-Website",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch contributors: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}

export function parseDownloads(assets: ReleaseAsset[]): PlatformDownloads {
  const downloads: PlatformDownloads = {};

  for (const asset of assets) {
    const name = asset.name.toLowerCase();

    if (name.endsWith("_universal.dmg")) {
      downloads.macOS = {
        label: "macOS (Universal)",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("x64-setup.exe") || name.includes("x64_en-us.msi")) {
      downloads.windowsX64 = {
        label: "Windows x64",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("arm64-setup.exe")) {
      downloads.windowsArm = {
        label: "Windows ARM64",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("amd64.deb")) {
      downloads.linuxX64Deb = {
        label: "Linux x64 (deb)",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("amd64.appimage")) {
      downloads.linuxX64AppImage = {
        label: "Linux x64 (AppImage)",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("arm64.deb")) {
      downloads.linuxArmDeb = {
        label: "Linux ARM64 (deb)",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    } else if (name.includes("arm64.appimage")) {
      downloads.linuxArmAppImage = {
        label: "Linux ARM64 (AppImage)",
        url: asset.browser_download_url,
        filename: asset.name,
        size: asset.size,
      };
    }
  }

  return downloads;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
