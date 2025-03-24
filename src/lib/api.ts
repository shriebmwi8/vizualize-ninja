
import axios from 'axios';
import { toast } from 'sonner';

// Mock data and functions since the backend is removed
const mockSessionId = 'mock-session-123';
const mockNumericFeatures = ['Age', 'Income', 'Spending', 'Savings', 'Credit Score'];
const mockCategoricalFeatures = ['Gender', 'Location', 'Education'];
const mockColumnNames = [...mockNumericFeatures, ...mockCategoricalFeatures];
const mockSampleData = [
  { Age: 34, Income: 65000, Spending: 15000, Savings: 10000, 'Credit Score': 720, Gender: 'Male', Location: 'Urban', Education: 'Bachelor' },
  { Age: 28, Income: 55000, Spending: 12000, Savings: 8000, 'Credit Score': 680, Gender: 'Female', Location: 'Suburban', Education: 'Master' },
  { Age: 45, Income: 85000, Spending: 20000, Savings: 30000, 'Credit Score': 750, Gender: 'Male', Location: 'Urban', Education: 'PhD' },
  { Age: 36, Income: 62000, Spending: 14000, Savings: 9000, 'Credit Score': 700, Gender: 'Female', Location: 'Rural', Education: 'Bachelor' },
  { Age: 52, Income: 95000, Spending: 25000, Savings: 40000, 'Credit Score': 800, Gender: 'Male', Location: 'Suburban', Education: 'Master' }
];

// Mock visualizations data
const mockVisualizations = {
  correlation_heatmap: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hByhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEZJBjFXpNb91//6z5+VnzcwLyZOfGEpD/nRtLQN6cG0tADpwbS0AaHWPz/2zn56PGEpCD+ZAExGZDEpCG+ZD7QxKQhvmQ+0MSkMj8wKvA/S0ISEOvUSMgJwjICQJygoCcICAnCMgJApKZDzlvLAHpOHdIAnKCgJwgICcIyAkCcoKAnCAgJwjICQJygoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGmA+5TCwB6XQ65LKxBGSQ0yGXjyUgHeZDLhtLQDrMh1w2loAMMh9yuVgCMkiEuwIBOUFAThCQEwTkBAE5QUBOEJATBOQEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxx95C7A/6ywPzAW43t/f6s+flZ8/OzA244ZPb7s+bnZ83Pzw642ciRvd+fNT8/a35+dsC3Rpbs/f6s+flZ8/Pen6/7a3o7fvr709PT4cPrWfPzmp/XPM/Gfy7NQTAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxx94A/Pz8f3v7e/Pvzyx+Htz8+Ph7evvh8/POP9z9+PP55+/b29vb29scf7x8e3j++ffj89ufPH73ff3h7ff38/Pz58+3t9fXl5eX7U/p5+vnbz7ffv7+/v3/9ev/19e3t7e3l5a+vX5/1/Zvn//77+/fvT09PT9++vb+/vn79+vL1W/r99Pvp9/X7y8vLy/Pzc3r/9vr16+vr6+vr6+vr65c0z7Pxn0tzEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQXJC8+HS8gLS3zfOXl7KY9I+fPD8/63j/1/S2S3pLPpvnL69lMelfeX5+1vH+o177VxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4HL++fcfbMqTIy7eIskAAAAASUVORK5CYII=',
  histograms: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hByhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBGSQYxV6TW/df/+s+flZ83MC8mTnxhKQ/50bS0DenBtLQA6cG0tAGh1j8/9s5+ejxhKQg/mQBMRmQxKQhvmQ+0MSkIb5kPtDEpDI/MCrwP0tCEhDr1EjICcIyAkCcoKAnCAgJwjICQJygoBk5kPOG0tAOs4dkoCcICAnCMgJAnKCgJwgICcIyAkCcoKAnCAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIeZDLhNLQDqdDrlsLAEZ5HTI5WMJSIf5kMvGEpAO8yGXjSUgg8yHXC6WgAwS4a5AQE4QkBME5AQBOUFAThCQEwTkBAE5QUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3k7oC/LDA/8FZje78/a35+1vz87IAbDpn9/qz5+Vnz87MDbjZyZO/3Z83Pz5qfnx3wrZEle78/a35+1vy89+fr/prejp/+/vT0dPjwetb8vObnNc+z8Z9LcxAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3gz8/Ph7e/N//+/PLH4e2Pj4+Hty8+Hz///P3Hj8c/b29vb29vb3/88f7h4f3j24fPb3/+/NH7/YfX19fPz8/Pnz/f3l5fX15evj+ln6efv/18+/37+/v716/3X1/f3t7eXl7++vr1Wd+/ef7vv79///709PT07dv7++vXry9fv6Xfz79/+P31Sz9/fn5O799ev379ev/69f7+/v7+/pLmeTb+c2kOgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCCyIvPh0vIO1t8/zlpSwm/eMnz8/POt7/Nb3tkl6Tz+b5y2tZTPpXnp+fdby/99r/A6lJdQMdk7vGAAAAAElFTkSuQmCC',
  boxplots: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hBwhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBGSQYxV6TW/df/+s+flZ83MC8mTnxhKQ/50bS0DenBtLQA6cG0tAGh1j8/9s5+ejxhKQg/mQBMRmQxKQhvmQ+0MSkIb5kPtDEpDI/MCrwP0tCEhDr1EjICcIyAkCcoKAnCAgJwjICQJygoBk5kPOG0tAOs4dkoCcICAnCMgJAnKCgJwgICcIyAkCcoKAnCAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIeZDLhNLQDqdDrlsLAEZ5HTI5WMJSIf5kMvGEpAO8yGXjSUgg8yHXC6WgAwS4a5AQE4QkBME5AQBOUFAThCQEwTkBAE5QUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3k7oC/LDA/8FZje78/a35+1vz87IAbDpn9/qz5+Vnz87MDbqW2Cze0z5qfnzU/Pzvgrdb9+1nz87Pm570/X/fX9Hb89Penp6fDh9ez5uc1P695no3/XJqDYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGOLuAX9+fj68/b3jz//y8sfxH3h8vP/D559f7u7ufn7XA/Pz89wDfnh4OD6v27vb44Xl6eXp8/zLy8t4Xw/Pz8+fnp/n5/X0/Pz8/e3t7fX19b7nX15fXl7SzzfP6/39x9cP/Xs9v75+fn5+/tz3rnlfz89fvnz58un+/v7+/v7+/v7jx4+fn8p8//jx/fv39/f379+/v34pz+k5PS/vfzp97q9f5/1/Lc/9z2/Ofzb+c2kOgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCCyIvPh0vIO1t8/zlpSwm/eMnz8/POt7/Nb3tkl6Sz+b5y2tZTPpXnp+fdby/99r/A5ixxXe52pXPAAAAAElFTkSuQmCC',
  pairplot: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hBwhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBGSQYxV6TW/df/+s+flZ83MC8mTnxhKQ/50bS0DenBtLQA6cG0tAGh1j8/9s5+ejxhKQg/mQBMRmQxKQhvmQ+0MSkIb5kPtDEpDI/MCrwP0tCEhDr1EjICcIyAkCcoKAnCAgJwjICQJygoBk5kPOG0tAOs4dkoCcICAnCMgJAnKCgJwgICcIyAkCcoKAnCAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIeZDLhNLQDqdDrlsLAEZ5HTI5WMJSIf5kMvGEpAO8yGXjSUgg8yHXC6WgAwS4a5AQE4QkBME5AQBOUFAThCQEwTkBAE5QUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3k7oC/LDA/8FZje78/a35+1vz87IAbDpn9/qz5+Vnz87MDbqW2Cze0z5qfnzU/Pzvgrdb9+1nz87Pm570/X/fX9Hb89Penp6fDh9ez5uc1P695no3/XJqDYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGOLuAX9+fj68/b3jz//y8sfxH3h8vP/D559f7u7ufn7XA/Pz89wDfnh4OD6v27vb44Xl6eXp8/zLy8t4Xw/Pz8+fnp/n5/X0/Pz8/e3t7fX19b7nX15fXl7SzzfP6/39x9cP/Xs9v75+fn5+/tz3rnlfz89fvnz58un+/v7+/v7+/v7jx4+fn8p8//jx/fv39/f379+/v34pz+k5PS/vfzp97q9f5/1/Lc/9z2/Ofzb+c2kOgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCCyIvPh0vIO1t8/zlpSwm/eMnz8/POt7/Nb3tkl6Sz+b5y2tZTPpXnp+fdby/99r/A5ixxXe52pXPAAAAAElFTkSuQmCC'
};

// Mock regression results
const mockRegressionResults = {
  model_results: {
    mse: 45.23,
    r2: 0.82,
    coefficients: {
      Age: 0.45,
      Income: 0.78,
      Spending: -0.32,
      Savings: 0.56
    },
    intercept: 120.5,
    num_samples: 500,
    test_size: 100
  },
  regression_plot: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hBwhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBGSQYxV6TW/df/+s+flZ83MC8mTnxhKQ/50bS0DenBtLQA6cG0tAGh1j8/9s5+ejxhKQg/mQBMRmQxKQhvmQ+0MSkIb5kPtDEpDI/MCrwP0tCEhDr1EjICcIyAkCcoKAnCAgJwjICQJygoBk5kPOG0tAOs4dkoCcICAnCMgJAnKCgJwgICcIyAkCcoKAnCAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIeZDLhNLQDqdDrlsLAEZ5HTI5WMJSIf5kMvGEpAO8yGXjSUgg8yHXC6WgAwS4a5AQE4QkBME5AQBOUFAThCQEwTkBAE5QUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3k7oC/LDA/8FZje78/a35+1vz87IAbDpn9/qz5+Vnz87MDbqW2Cze0z5qfnzU/Pzvgrdb9+1nz87Pm570/X/fX9Hb89Penp6fDh9ez5uc1P695no3/XJqDYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGOLuAX9+fj68/b3jz//y8sfxH3h8vP/D559f7u7ufn7XA/Pz89wDfnh4OD6v27vb44Xl6eXp8/zLy8t4Xw/Pz8+fnp/n5/X0/Pz8/e3t7fX19b7nX15fXl7SzzfP6/39x9cP/Xs9v75+fn5+/tz3rnlfz89fvnz58un+/v7+/v7+/v7jx4+fn8p8//jx/fv39/f379+/v34pz+k5PS/vfzp97q9f5/1/Lc/9z2/Ofzb+c2kOgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCCyIvPh0vIO1t8/zlpSwm/eMnz8/POt7/Nb3tkl6Sz+b5y2tZTPpXnp+fdby/99r/A5ixxXe52pXPAAAAAElFTkSuQmCC',
  feature_importance: {
    data: [
      { Feature: 'Income', Importance: 0.78 },
      { Feature: 'Savings', Importance: 0.56 },
      { Feature: 'Age', Importance: 0.45 },
      { Feature: 'Spending', Importance: 0.32 }
    ],
    image: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVHhe7dxBbttGGIfxT1RWXfQGOUJ8hBwhR+gRepQeoUfoEXKEHMHZddHF6LUdA4FA6Y2oEYdDzvD/AYJ4EQvG8OibGVJO/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCF/Pvjn79Hfuv+DaP8vPs3cJZvUiQJCGchIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCMiZ9FrxXlOc9lrxXlOc9lrxXlOc9lrxXlOc9lrx01/TW+/fz5qfnzU/v3m+1/y85uc1P695vtf8vObnNc/3mp/X/LzmeTb+cxEQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARDEBAMQUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBGSQYxV6TW/df/+s+flZ83MC8mTnxhKQ/50bS0DenBtLQA6cG0tAGh1j8/9s5+ejxhKQg/mQBMRmQxKQhvmQ+0MSkIb5kPtDEpDI/MCrwP0tCEhDr1EjICcIyAkCcoKAnCAgJwjICQJygoBk5kPOG0tAOs4dkoCcICAnCMgJAnKCgJwgICcIyAkCcoKAnCAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIeZDLhNLQDqdDrlsLAEZ5HTI5WMJSIf5kMvGEpAO8yGXjSUgg8yHXC6WgAwS4a5AQE4QkBME5AQBOUFAThCQEwTkBAE5QUAwBAHBEAQEQxAQDEFAMAQBwRAEBEMQEAxBQDAEAcEQBARD3D3k7oC/LDA/8FZje78/a35+1vz87IAbDpn9/qz5+Vnz87MDbqW2Cze0z5qfnzU/Pzvgrdb9+1nz87Pm570/X/fX9Hb89Penp6fDh9ez5uc1P695no3/XJqDYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGOLuAX9+fj68/b3jz//y8sfxH3h8vP/D559f7u7ufn7XA/Pz89wDfnh4OD6v27vb44Xl6eXp8/zLy8t4Xw/Pz8+fnp/n5/X0/Pz8/e3t7fX19b7nX15fXl7SzzfP6/39x9cP/Xs9v75+fn5+/tz3rnlfz89fvnz58un+/v7+/v7+/v7jx4+fn8p8//jx/fv39/f379+/v34pz+k5PS/vfzp97q9f5/1/Lc/9z2/Ofzb+c2kOgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCIQgIhiAgGIKAYAgCgiEICIYgIBiCgGAIAoIhCAiGICAYgoBgCAKCCyIvPh0vIO1t8/zlpSwm/eMnz8/POt7/Nb3tkl6Sz+b5y2tZTPpXnp+fdby/99r/A5ixxXe52pXPAAAAAElFTkSuQmCC'
  }
};

// Mock session data in localStorage - simulate what would be stored after an upload
localStorage.setItem('sessionId', mockSessionId);
localStorage.setItem('columnNames', JSON.stringify(mockColumnNames));
localStorage.setItem('sampleData', JSON.stringify(mockSampleData));
localStorage.setItem('numericFeatures', JSON.stringify(mockNumericFeatures));
localStorage.setItem('categoricalFeatures', JSON.stringify(mockCategoricalFeatures));
localStorage.setItem('stats', JSON.stringify({
  rows: 250,
  columns: mockColumnNames.length,
  column_names: mockColumnNames,
  missing_values: { Age: 5, Income: 2, Location: 3 },
  data_types: { 
    Age: 'int64', 
    Income: 'float64', 
    Spending: 'float64', 
    Savings: 'float64', 
    'Credit Score': 'int64',
    Gender: 'object',
    Location: 'object',
    Education: 'object' 
  },
  sample_data: mockSampleData
}));
localStorage.setItem('visualizations', JSON.stringify(mockVisualizations));

// Check server connection
export const checkServerConnection = async (): Promise<boolean> => {
  console.log('This is a mock implementation without a real backend server');
  return true; // Always return true since we're mocking functionality
};

// Upload file to backend
export const uploadFile = async (file: File): Promise<any> => {
  try {
    console.log('Mock file upload for:', file.name);
    
    // Mock successful upload response
    const response = {
      session_id: mockSessionId,
      stats: {
        rows: 250,
        columns: mockColumnNames.length,
        column_names: mockColumnNames,
        missing_values: { Age: 5, Income: 2, Location: 3 },
        data_types: { 
          Age: 'int64', 
          Income: 'float64', 
          Spending: 'float64', 
          Savings: 'float64', 
          'Credit Score': 'int64',
          Gender: 'object',
          Location: 'object',
          Education: 'object' 
        },
        sample_data: mockSampleData
      },
      numeric_features: mockNumericFeatures,
      categorical_features: mockCategoricalFeatures
    };
    
    // Save session data to localStorage
    updateLocalStorage(response);
    
    return response;
  } catch (error) {
    console.error('Mock error uploading file:', error);
    handleApiError(error, 'Error uploading file');
    throw error;
  }
};

// Get data preview
export const getDataPreview = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // Use the sample_data saved in localStorage
    return {
      columns: JSON.parse(localStorage.getItem('columnNames') || '[]'),
      data: JSON.parse(localStorage.getItem('sampleData') || '[]')
    };
  } catch (error) {
    console.error('Mock error getting data preview:', error);
    handleApiError(error, 'Error getting data preview');
    throw error;
  }
};

// Process data
export const processData = async (option: string): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    console.log('Mock processing data with option:', option);
    
    // Mock successful processing response
    const response = {
      message: 'Data processed successfully',
      visualizations: mockVisualizations
    };
    
    // Save visualizations data to localStorage
    updateVisualizationsStorage(response);
    
    return response;
  } catch (error) {
    console.error('Mock error processing data:', error);
    handleApiError(error, 'Error processing data');
    throw error;
  }
};

// Get data summary
export const getDataSummary = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    
    return {
      shape: { rows: stats.rows || 0, columns: stats.columns || 0 },
      missingValues: stats.missing_values || {},
      uniqueValues: {
        Gender: ['Male', 'Female'],
        Location: ['Urban', 'Suburban', 'Rural'],
        Education: ['Bachelor', 'Master', 'PhD']
      },
      dataTypes: stats.data_types || {},
      statistics: {
        Age: { min: 25, max: 65, mean: 42.5, median: 41, std: 8.2 },
        Income: { min: 35000, max: 120000, mean: 68500, median: 65000, std: 12000 },
        Spending: { min: 10000, max: 50000, mean: 22000, median: 20000, std: 8000 },
        Savings: { min: 5000, max: 80000, mean: 32000, median: 28000, std: 15000 },
        'Credit Score': { min: 580, max: 850, mean: 720, median: 730, std: 65 }
      }
    };
  } catch (error) {
    console.error('Mock error getting data summary:', error);
    handleApiError(error, 'Error getting data summary');
    throw error;
  }
};

// Get visualizations
export const getVisualizations = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // Use the visualizations data from localStorage
    const visualizations = JSON.parse(localStorage.getItem('visualizations') || '{}');
    
    // Transform from base64 to URLs
    return {
      correlation_heatmap: `data:image/png;base64,${visualizations.correlation_heatmap}`,
      histograms: `data:image/png;base64,${visualizations.histograms}`,
      boxplot: `data:image/png;base64,${visualizations.boxplots}`,
      pairplot: `data:image/png;base64,${visualizations.pairplot || ''}` // Added for compatibility
    };
  } catch (error) {
    console.error('Mock error getting visualizations:', error);
    handleApiError(error, 'Error getting visualizations');
    throw error;
  }
};

// Run regression
export const runRegression = async (targetVariable: string): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    console.log('Mock running regression for target:', targetVariable);
    
    // Use mock regression results but customize for the target variable
    const results = { ...mockRegressionResults };
    results.model_results.num_samples = 250; // Match our mock data size
    
    return results;
  } catch (error) {
    console.error('Mock error running regression:', error);
    handleApiError(error, 'Error running regression analysis');
    throw error;
  }
};

// Download cleaned data
export const downloadCleanedData = async (): Promise<void> => {
  try {
    // Create a mock CSV data
    const headers = mockColumnNames.join(',');
    const rows = mockSampleData.map((row: any) => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Mock cleaned data downloaded successfully');
  } catch (error) {
    console.error('Mock error downloading cleaned data:', error);
    handleApiError(error, 'Error downloading cleaned data');
    throw error;
  }
};

// Download report
export const downloadReport = async (): Promise<void> => {
  try {
    // Create a mock report
    const reportContent = `
DATA ANALYSIS REPORT
====================

DATASET INFORMATION
Number of rows: 250
Number of columns: 8
Columns: Age, Income, Spending, Savings, Credit Score, Gender, Location, Education

MISSING VALUES
Age: 5
Income: 2
Location: 3

NUMERIC STATISTICS

Age:
  Min: 25
  Max: 65
  Mean: 42.5
  Median: 41
  Std Dev: 8.2

Income:
  Min: 35000
  Max: 120000
  Mean: 68500
  Median: 65000
  Std Dev: 12000

Spending:
  Min: 10000
  Max: 50000
  Mean: 22000
  Median: 20000
  Std Dev: 8000

REGRESSION ANALYSIS
Target Variable: ${mockRegressionResults.model_results.target_variable || 'Credit Score'}
R² Score: ${mockRegressionResults.model_results.r2}
Mean Squared Error: ${mockRegressionResults.model_results.mse}

Feature Importance:
  Income: 0.78
  Savings: 0.56
  Age: 0.45
  Spending: 0.32
`;
    
    // Create a Blob and download
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data_analysis_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Mock report downloaded successfully');
  } catch (error) {
    console.error('Mock error downloading report:', error);
    handleApiError(error, 'Error downloading report');
    throw error;
  }
};

// Download results
export const downloadResults = async (): Promise<void> => {
  try {
    // Use the mock regression results
    const resultsJson = JSON.stringify(mockRegressionResults.model_results, null, 2);
    
    // Create a Blob and download
    const blob = new Blob([resultsJson], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'regression_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Mock results downloaded successfully');
  } catch (error) {
    console.error('Mock error downloading results:', error);
    handleApiError(error, 'Error downloading results');
    throw error;
  }
};

// Download visualization
export const downloadVisualization = async (visualizationType: string): Promise<void> => {
  try {
    // Get visualization data from localStorage
    const visualizations = JSON.parse(localStorage.getItem('visualizations') || '{}');
    const base64Data = visualizations[visualizationType];
    
    if (!base64Data) {
      throw new Error(`Visualization ${visualizationType} not found`);
    }
    
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = `${visualizationType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Mock ${visualizationType} visualization downloaded successfully`);
  } catch (error) {
    console.error('Mock error downloading visualization:', error);
    handleApiError(error, 'Error downloading visualization');
    throw error;
  }
};

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot connect to the backend server. Please ensure the server is running on http://localhost:5000.';
    } else if (error.response) {
      // Server responded with an error
      const serverMessage = error.response.data?.error || error.response.data?.message;
      if (serverMessage) {
        errorMessage = `Server error: ${serverMessage}`;
      } else {
        errorMessage = `Server error (${error.response.status})`;
      }
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
};

// Update localStorage with session data
export const updateLocalStorage = (data: any) => {
  localStorage.setItem('sessionId', data.session_id);
  localStorage.setItem('stats', JSON.stringify(data.stats));
  localStorage.setItem('columnNames', JSON.stringify(data.stats.column_names));
  localStorage.setItem('sampleData', JSON.stringify(data.stats.sample_data));
  localStorage.setItem('numericFeatures', JSON.stringify(data.numeric_features));
  localStorage.setItem('categoricalFeatures', JSON.stringify(data.categorical_features));
};

// Update localStorage with visualizations data
export const updateVisualizationsStorage = (data: any) => {
  localStorage.setItem('visualizations', JSON.stringify(data.visualizations));
};

