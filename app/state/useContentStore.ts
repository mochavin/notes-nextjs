import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentStore {
  idContent: string;
  title: string;
  subtitle: string;
  content: string;
  setIdContent: (id: string) => void;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      idContent: 'home',
      title: 'Home',
      subtitle: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor ligula nec pretium faucibus.Phasellus accumsan a augue et efficitur.`,
      content: `Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales pharetra ipsum. Nulla semper metus vel porttitor ornare. Praesent ultricies, justo ac volutpat rhoncus, nulla urna consectetur massa, a porttitor felis sapien at nibh.
    
              Aenean maximus ullamcorper est, nec pretium dui dapibus ut. Nullam arcu tortor, dignissim id orci ac, vestibulum posuere ipsum. Suspendisse vel augue eget libero scelerisque euismod. Suspendisse vulputate erat id est ultrices, vel ultrices ligula ornare. Aliquam libero lacus, egestas eu arcu in, sodales
    `,

      setIdContent: (id: string) => set({ idContent: id }),
    }),
    {
      name: 'content-state-storage',
    }
  )
);
