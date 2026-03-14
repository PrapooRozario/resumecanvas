import type { Block } from '@/types/blocks'

export const dummyBlocks: Block[] = [
    {
        id: '1',
        type: 'photo',
        order_index: 0,
        content: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', size: 60 }
    },
    {
        id: '2',
        type: 'heading',
        order_index: 1,
        content: { text: 'Sara Lawrence', level: 1 }
    },
    {
        id: '3',
        type: 'text',
        order_index: 2,
        content: { html: '<p style="margin:0; font-size:12px; color: var(--resume-muted)">Design in San Francisco</p><p style="margin:0; font-size: 11px; margin-top: 4px;"><span style="background: var(--resume-surface); padding: 2px 6px; border: 1px solid var(--resume-border); border-radius: 4px; display:inline-block;">website.com</span></p>' }
    },
    {
        id: '4',
        type: 'heading',
        order_index: 3,
        content: { text: 'About', level: 2 }
    },
    {
        id: '5',
        type: 'text',
        order_index: 4,
        content: { html: "<p>I'm a passionate UX designer striving to create intuitive and engaging experiences. I'm a big believer that things can always be simpler than we think.</p>" }
    },
    {
        id: '6',
        type: 'heading',
        order_index: 5,
        content: { text: 'Work Experience', level: 2 }
    },
    {
        id: '7',
        type: 'experience',
        order_index: 6,
        content: {
            role: 'Senior Designer',
            company: 'Magic Design Co',
            url: '#',
            startDate: '2017',
            endDate: 'Now',
            location: 'San Francisco, CA'
        }
    },
    {
        id: '8',
        type: 'experience',
        order_index: 7,
        content: {
            role: 'Junior Designer',
            company: 'Creative Co',
            url: '#',
            startDate: '2015',
            endDate: '2017',
            location: 'Atlanta, GA',
            description: '<div style="display:flex; gap:10px; margin-top:12px;"><img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=150&h=100" style="width:100px; height:60px; border-radius:6px; border: 1px solid var(--resume-border); object-fit:cover;"/><img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=150&h=100" style="width:100px; height:60px; border-radius:6px; border: 1px solid var(--resume-border); object-fit:cover;"/><img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=150&h=100" style="width:100px; height:60px; border-radius:6px; border: 1px solid var(--resume-border); object-fit:cover;"/></div>'
        }
    },
    {
        id: '9',
        type: 'experience',
        order_index: 8,
        content: {
            role: 'Intern',
            company: 'Design Hub',
            url: '#',
            startDate: '2014',
            endDate: '2015',
            location: 'Atlanta, GA'
        }
    },
    {
        id: '10',
        type: 'experience',
        order_index: 9,
        content: {
            role: 'Freelance Graphic Designer',
            startDate: '2012',
            endDate: '2014',
            location: 'Remote'
        }
    },
    {
        id: '11',
        type: 'experience',
        order_index: 10,
        content: {
            role: 'Art Assistant',
            company: 'Studio X',
            url: '#',
            startDate: '2010',
            endDate: '2012',
            location: 'Cincinnati, OH'
        }
    },
    {
        id: '12',
        type: 'experience',
        order_index: 11,
        content: {
            role: 'Volunteer Designer',
            company: 'Nonprofit Y',
            url: '#',
            startDate: '2008',
            endDate: '2010',
            location: 'Cincinnati, OH'
        }
    },
    {
        id: '13',
        type: 'heading',
        order_index: 12,
        content: { text: 'Writing', level: 2 }
    },
    {
        id: '14',
        type: 'experience',
        order_index: 13,
        content: {
            role: 'Exploring the Intersection of Design and Technology',
            url: '#',
            startDate: '2023',
            location: 'Collaboration with Mia, Leo, and Ava',
            description: '<div style="display:flex; align-items:center; gap:16px; margin-top:16px; padding:12px; border:1px solid var(--resume-border); border-radius:8px; background:var(--resume-surface); max-width: 400px;"><img src="https://images.unsplash.com/photo-1541506618330-7c369fc759b5?auto=format&fit=crop&q=80&w=150&h=100" style="width:80px; height:50px; border-radius:4px; object-fit:cover;"/><div style="flex:1"><p style="margin:0; font-weight:500; font-size:12px; color:var(--resume-text);">This is a site title that can go...</p><p style="margin:2px 0 0 0; font-size:11px; color:var(--resume-muted);">1 min read</p></div></div>'
        }
    },
    {
        id: '15',
        type: 'experience',
        order_index: 14,
        content: {
            role: 'Understanding Design Hierarchies',
            url: '#',
            startDate: '2023',
            location: 'Worked alongside Alex',
        }
    },
    {
        id: '16',
        type: 'experience',
        order_index: 15,
        content: {
            role: 'The Art of User-Centered Design',
            url: '#',
            startDate: '2020',
        }
    },
    {
        id: '17',
        type: 'experience',
        order_index: 16,
        content: {
            role: 'Navigating Design Challenges',
            startDate: '2019',
        }
    },
    {
        id: '18',
        type: 'experience',
        order_index: 17,
        content: {
            role: 'Crafting Engaging User Experiences',
            url: '#',
            startDate: '2018',
        }
    },
    {
        id: '19',
        type: 'experience',
        order_index: 18,
        content: {
            role: 'Building a Cohesive Design Language',
            url: '#',
            startDate: '2016',
        }
    },
    {
        id: '20',
        type: 'experience',
        order_index: 19,
        content: {
            role: 'The Power of Visual Storytelling',
            url: '#',
            startDate: '2017',
        }
    },
    {
        id: '21',
        type: 'heading',
        order_index: 20,
        content: { text: 'Speaking', level: 2 }
    },
    {
        id: '22',
        type: 'experience',
        order_index: 21,
        content: {
            role: 'Designing for accessibility',
            url: '#',
            startDate: '2024',
            location: 'Los Angeles, CA'
        }
    },
    {
        id: '23',
        type: 'experience',
        order_index: 22,
        content: {
            role: 'How to make things super simple',
            url: '#',
            startDate: '2024',
            location: 'Miami, FL'
        }
    },
    {
        id: '24',
        type: 'experience',
        order_index: 23,
        content: {
            role: 'Designing your career',
            url: '#',
            startDate: '2023',
        }
    },
    {
        id: '25',
        type: 'heading',
        order_index: 24,
        content: { text: 'Side Projects', level: 2 }
    },
    {
        id: '26',
        type: 'experience',
        order_index: 25,
        content: {
            role: 'Nature walks',
            url: '#',
            startDate: '2021',
        }
    },
    {
        id: '27',
        type: 'experience',
        order_index: 26,
        content: {
            role: 'Plant-based cookware',
            url: '#',
            startDate: '2020',
        }
    },
    {
        id: '28',
        type: 'experience',
        order_index: 27,
        content: {
            role: 'Interactive art installation',
            url: '#',
            startDate: '2019',
        }
    },
    {
        id: '29',
        type: 'heading',
        order_index: 28,
        content: { text: 'Education', level: 2 }
    },
    {
        id: '30',
        type: 'education',
        order_index: 29,
        content: {
            degree: "Master's in Interaction Design",
            institution: 'Georgia Tech',
            startDate: '2010',
            endDate: '2010',
            location: 'Atlanta, GA'
        }
    },
    {
        id: '31',
        type: 'education',
        order_index: 30,
        content: {
            degree: "Bachelor's in Communication Design",
            institution: 'University of Cincinnati',
            startDate: '2006',
            endDate: '2010',
            location: 'Cincinnati, OH'
        }
    },
    {
        id: '32',
        type: 'heading',
        order_index: 31,
        content: { text: 'Contact', level: 2 }
    },
    {
        id: '33',
        type: 'social_links',
        order_index: 32,
        content: {
            links: [
                { platform: 'Threads', url: 'https://threads.net/username' },
                { platform: 'Figma', url: 'https://figma.com/@username' },
                { platform: 'Instagram', url: 'https://instagram.com/username' },
                { platform: 'Bluesky', url: 'https://bsky.app/profile/username' },
                { platform: 'Mastodon', url: 'https://mastodon.social/@username' },
                { platform: 'X', url: 'https://x.com/username' }
            ]
        }
    }
]
