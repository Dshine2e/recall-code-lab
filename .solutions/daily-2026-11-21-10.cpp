#include <bits/stdc++.h>
using namespace std;

int K;
string S;
long long memo[20][11][200];
bool seen[20][11][200];

// pos: 지금 자리, prev: 앞 숫자(10 = 아직 시작 안 함), mod: 지금까지 자릿수 합 % K, tight: 상한에 붙어 있는지
long long go(int pos, int prev, int mod, bool tight) {
    if (pos == (int)S.size()) return (prev != 10 && mod == 0) ? 1 : 0;
    if (!tight && seen[pos][prev][mod]) return memo[pos][prev][mod];
    int lim = tight ? S[pos] - '0' : 9;
    long long res = 0;
    for (int dg = 0; dg <= lim; dg++) {
        bool nt = tight && dg == lim;
        if (prev == 10) {
            if (dg == 0) res += go(pos + 1, 10, 0, nt);
            else res += go(pos + 1, dg, dg % K, nt);
        } else {
            if (dg == prev) continue;
            res += go(pos + 1, dg, (mod + dg) % K, nt);
        }
    }
    if (!tight) {
        seen[pos][prev][mod] = true;
        memo[pos][prev][mod] = res;
    }
    return res;
}

long long solve(long long n) {
    if (n <= 0) return 0;
    S = to_string(n);
    memset(seen, 0, sizeof(seen));
    return go(0, 10, 0, true);
}

int main() {
    long long a, b;
    cin >> a >> b >> K;
    cout << solve(b) - solve(a - 1) << '\n';
    return 0;
}
