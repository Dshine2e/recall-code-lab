#include <bits/stdc++.h>
using namespace std;

int H, W;
vector<string> b;

// 지울 칸을 표시하고 개수를 돌려준다
int markRuns(vector<vector<char>> &del) {
    del.assign(H, vector<char>(W, 0));
    int cnt = 0;
    for (int r = 0; r < H; r++)
        for (int c = 0; c < W; c++) {
            char x = b[r][c];
            if (x == '.') continue;
            // 가로: 이 칸이 길이 3 이상 줄에 속하는지 양쪽으로 세기
            int L = c, R = c;
            while (L - 1 >= 0 && b[r][L - 1] == x) L--;
            while (R + 1 < W && b[r][R + 1] == x) R++;
            int U = r, D = r;
            while (U - 1 >= 0 && b[U - 1][c] == x) U--;
            while (D + 1 < H && b[D + 1][c] == x) D++;
            if (R - L + 1 >= 3 || D - U + 1 >= 3) {
                del[r][c] = 1;
                cnt++;
            }
        }
    return cnt;
}

int main() {
    cin >> H >> W;
    b.resize(H);
    for (auto &s : b) cin >> s;
    int q;
    cin >> q;
    long long score = 0;
    int bad = 0;
    vector<vector<char>> del;
    while (q--) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        r1--, c1--, r2--, c2--;
        if (b[r1][c1] == '.' || b[r2][c2] == '.') {
            bad++;
            continue;
        }
        swap(b[r1][c1], b[r2][c2]);
        int cnt = markRuns(del);
        if (cnt == 0) {
            swap(b[r1][c1], b[r2][c2]);
            bad++;
            continue;
        }
        for (int round = 1; cnt > 0; round++) {
            score += 1LL * cnt * round;
            for (int r = 0; r < H; r++)
                for (int c = 0; c < W; c++)
                    if (del[r][c]) b[r][c] = '.';
            for (int c = 0; c < W; c++) {
                int wr = H - 1;
                for (int r = H - 1; r >= 0; r--)
                    if (b[r][c] != '.') {
                        char x = b[r][c];
                        b[r][c] = '.';
                        b[wr][c] = x;
                        wr--;
                    }
            }
            cnt = markRuns(del);
        }
    }
    cout << score << '\n' << bad << '\n';
    for (auto &s : b) cout << s << '\n';
    return 0;
}
