#include <bits/stdc++.h>
using namespace std;
string s;
long long target;
int n;
long long cnt = 0;
void go(int pos, long long total) {
    int limit = (s[pos] == '0') ? pos + 1 : n;
    long long val = 0;
    for (int end = pos + 1; end <= limit; end++) {
        val = val * 10 + (s[end - 1] - '0');
        long long cand[2];
        int k = 0;
        if (pos == 0) cand[k++] = val;
        else { cand[k++] = total + val; cand[k++] = total - val; }
        for (int i = 0; i < k; i++) {
            if (end == n) { if (cand[i] == target) cnt++; }
            else go(end, cand[i]);
        }
    }
}
int main() {
    cin >> s >> target;
    n = s.size();
    go(0, 0);
    cout << cnt << "\n";
    return 0;
}
