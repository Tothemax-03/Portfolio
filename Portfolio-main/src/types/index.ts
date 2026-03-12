export interface Experience {
  jobTitle: string;
  companyName: string;
  date: string;
  current: boolean;
}

export interface frontEndSkills {
  name: string;
}

export interface backEndSkills {
  name: string;
}

export interface otherSkills {
  name: string;
}

export interface devOpsCloudSkills {
  name: string;
}

export interface Projects {
  title: string;
  description: string;
  link: string;
  domainName: string;
}

export interface GalleryItem {
  id: number;
  imgSrc: string;
}
