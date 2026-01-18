export type FundStatus = 'Live' | 'Backtest' | 'Waitlist';

export interface Holding {
  name: string;
  ticker: string;
  allocation: number; // percentage
  side: 'YES' | 'NO';
  prob: number;
  expiry: string;
  return?: number;
  description?: string;
  rationale?: string;
}

export interface Fund {
  id: string;
  name: string;
  thesis: string;
  secondaryThesis: string;
  logo: string; // URL
  metrics: {
    sharpe?: number;
    nav?: number;
    aum?: number;
  };
  holdings: Holding[];
  tags: string[];
  createdBy: string;
}

export const funds: Fund[] = [
  {
    id: "alpha-flow",
    name: "Alpha Flow Strategy",
    thesis: "Macro Hedges",
    secondaryThesis: "Exploits short-term volatility in major political events.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaH1D2k4xKxrOVqIQg0zYLkO2uHyZOsoRuuEBi4pjam4VIbdx94C6xitf0a3aTzk6TqONua-A43wkdoqJwq12IW12nUGF5tfXJ_f2h0uMrZol-TNlq-AlhsLAZeWTmTNoSLlv9wuLvgpJmPa68HzJbPIZEyGpRPwleU6tqT3w8dDwTzmF1jLnPZQmK1Z102iXF2E5tj_xfxDFXpMqncXQtGL_Qd0VbWnGnyydplrq2BewredhpnQXOYmVMBcgUD9NowTCvbk2oY3r6",
    metrics: { sharpe: 2.85, nav: 42.85, aum: 53.1 },
    tags: ["Politics", "Macro"],
    holdings: [
       { name: "ETH ETF Approval", ticker: "ETH ETF", side: "YES", allocation: 45, prob: 68, expiry: "Sep 18" },
       { name: "SOL ETF Approval", ticker: "SOL ETF", side: "NO", allocation: 30, prob: 52, expiry: "Nov 5" },
       { name: "BTC > 70K", ticker: "BTC > 70K", side: "YES", allocation: 15, prob: 35, expiry: "Dec 31" }
    ],
    createdBy: 'Satoshi Nakamoto'
  },
  {
    id: "election-oracle",
    name: "Election Oracle AI",
    thesis: "Predictive Model",
    secondaryThesis: "AI-driven sentiment analysis on US elections.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkEtq4V3df9hHw8CZO8UBzyFtqFTGRmfMIfxzHqVJcpJQsEPQcN5_o0HFev8PGgViy1xKBlxg5hAWIPqx4CDP_f1TT1CFZhXG_s9w3V19PbWXf6ViQs6wNckQ1or2jzqpflECNXX3y4H2nFgRnC7fcQp_gmTKJuCHJcbppTzUzcM0-PRb-sqh7dlJnxco-PBx5VXg8IGVbDIY5vTpHCK5GbC8NVoMzmZX9Ywyvxps7_mylMFEG4SSXPKcFSE0DNHaPa8RE74TWDk6x",
    metrics: {},
    tags: ["AI", "Election"],
    holdings: [
        { name: "Dem Senate Control", ticker: "Dem Senate", side: "YES", allocation: 60, prob: 45, expiry: "Nov 5" },
        { name: "GOP House Control", ticker: "GOP House", side: "YES", allocation: 25, prob: 55, expiry: "Nov 5" },
        { name: "Newsom Run 2028", ticker: "Newsom 2028", side: "YES", allocation: 10, prob: 20, expiry: "Dec 31" }
    ],
    createdBy: 'Alice Bob'
  },
   {
    id: "global-macro",
    name: "Global Macro Events",
    thesis: "Central Banks",
    secondaryThesis: "Trading interest rate probabilities worldwide.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqZR3TeUh8FzIO-jSvqIefPGBkX5Wy9F_VxVi6fLFbuFEIuHZGtF3yWXR87dNY7aD65TggVwYb0Cd6uC4Ps0I_PCYqpZYO2mw_XuKjTgvHXLe636_PKhA_QBZTN7Jyo7LRNkmylz-iSglxxUhV973h3n5UfXrYAYwGivYetzUiir6_ntVOyEuxqctk7gYSztV0xMRUcoqLfz4IKeBYznwW0J5iuMqBrzcmMcvWmmXtLbyWORjihHOhhrjNO44obAouzG5gVwaoY1uv",
    metrics: {},
    tags: ["Macro", "Rates"],
    holdings: [
        { name: "Fed Cut", ticker: "Fed Cut", side: "YES", allocation: 50, prob: 80, expiry: "Sep 18" },
        { name: "EU Inflation > 2%", ticker: "EU CPI", side: "YES", allocation: 30, prob: 60, expiry: "Oct 1" },
        { name: "Oil > 80", ticker: "Oil > 80", side: "YES", allocation: 15, prob: 40, expiry: "Dec 1" }
    ],
    createdBy: 'Global Trader'
  },
  {
    id: "crypto-vol",
    name: "Crypto Volatility 2X",
    thesis: "Algo Trading",
    secondaryThesis: "Automated bets on crypto price milestones.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7BTZq6vqRrre7IXYI-jUhrkJTjYmaTLPs_-fsqXpdTn1FuTt-zOBeflmcBB-mG4ctQNqo-d826sXIKtx6BqY_pPzXa1pvauQxi9uqVrYa2bwfMObMVrFqnm8XrF1gHfm_t8AiRfwlsrrPstJaHNhMc5jtaOiJpNaud5Pq3dwxEmtvdZ3e8bY7Tocq_LTF1u_9BQQtkKi4M4gHHPFLuD2ArvEFeVtmhri_cCENhNt3x8040f_JtrWcFi1fApIOFh_PrLrJpTqkYOrh",
    metrics: {},
    tags: ["Crypto", "Algo"],
    holdings: [
         { name: "ETH > 3K", ticker: "ETH > 3K", side: "YES", allocation: 55, prob: 60, expiry: "Dec 31" },
         { name: "SOL > 150", ticker: "SOL > 150", side: "YES", allocation: 35, prob: 70, expiry: "Dec 31" },
         { name: "USDT De-peg", ticker: "USDT De-peg", side: "NO", allocation: 5, prob: 99, expiry: "Dec 31" }
    ],
    createdBy: 'Crypto King'
  },
  {
    id: "sports-arb",
    name: "Sports Arbitrage",
    thesis: "Event Driven",
    secondaryThesis: "Capturing spreads across major sporting outcomes.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkJyXmRIc8n-V07EDcKCw1COdtDX4XWPIwQiqwVWuKKFeD0ZPG96euDoQvIMk2x477Vj2SH6nVGjd8F5_1SDcWk7oFAsmV6shIRlfUznzXfMcPkhxl-F-DYxWTzcqse4U-YfDXmwbArUEHLhI-zuO7gyHSjmgErPG7gZZK24vMBPhiF7VEgCd9Kp5Bq3bGc7yRQ2pzqSuHLiPZbUX22NsIoIK2v6qK9SzITJVwSM2WUxaUiAywu1pIgQzcvG5C649xy2H7Ab_btOu0",
    metrics: {},
    tags: ["Sports", "Arb"],
    holdings: [
        { name: "KC Chiefs Win", ticker: "KC Chiefs", side: "YES", allocation: 40, prob: 60, expiry: "Feb 11" },
        { name: "Lakers Win", ticker: "Lakers", side: "YES", allocation: 35, prob: 55, expiry: "Tonight" },
        { name: "Man City Win", ticker: "Man City", side: "YES", allocation: 20, prob: 75, expiry: "Saturday" }
    ],
    createdBy: 'Sports Bettor'
  }
];
